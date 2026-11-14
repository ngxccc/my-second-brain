---
tags: [type/method, status/permanent]
date: 2026-10-04
description: "Lộ trình làm chủ Reverse Engineering theo nguyên tắc 80/20, tập trung vào x86_64/ARM64 Calling Conventions, File Formats (PE/ELF/DEX), Decompilation, Dynamic Instrumentation với Frida, và Phân tích Memory/Protocols."
---

# Nghiên cứu Reverse Engineering: Tiêu chuẩn Nắm chắc và Phương pháp học 80/20

## TL;DR

- **Bản chất**: Lộ trình chắt 20% kiến thức Binary Systems: Calling Conventions, Stack Frames, PE/ELF/DEX, Static Decompilation (Ghidra/Jadx), Dynamic Instrumentation (Frida/Debugger).
- **Mục đích**: Phân tích luồng thực thi nhị phân, bóc cấu trúc dữ liệu runtime, gỡ cơ chế phòng thủ (TLS Pinning, Anti-Debugging, Checksum), bóc Network Protocol/API và tái thiết kế logic phần mềm.
- **Điểm mấu chốt**: Ghép Static Map-making (Cross-References, Strings, API) với Dynamic Ground-truth Extraction (Frida Hooks, Memory Debugging) để biến nhị phân hộp đen thành thứ quan sát được.

---

## Core Concepts: Tiêu chuẩn Nắm chắc Reverse Engineering

- **Ranh giới năng lực:** giữa người chạy script có sẵn hoặc mở decompiler rồi bối rối trước mã giả, và kỹ sư nắm chắc Reverse Engineering, nằm ở tư duy **Binary Systems Engineering**.
- **Ba năng lực của ranh giới đó:** hiểu CPU thực thi mã lệnh thế nào, hiểu OS nạp và ánh xạ file thực thi vào bộ nhớ ra sao, và điều hướng có chủ đích trong không gian nhị phân không có mã nguồn.
- **Mốc nghiệm thu:** 5 tiêu chuẩn kiểm chứng bên dưới.

### 1. Làm chủ Computer Architecture cơ bản và Compiler Idioms (x86_64 và ARM64)

- **Bản chất**: Hiểu cách compiler hạ cấp (lower) các cấu trúc lập trình bậc cao (C/C++, Java, Go, Rust) thành Machine Code và Assembly ([OpenSecurityTraining2: Architecture 1001](https://opensecuritytraining.info/Training.html) và [Dennis Yurichev: Reverse Engineering for Beginners](https://challenges.re/)).
- **Tiêu chuẩn đánh giá**:
  - Nắm vững thanh ghi và vai trò:
    - **x86_64**: General Purpose Registers (`RAX`, `RBX`, `RCX`, `RDX`, `RSI`, `RDI`, `R8`–`R15`), Stack Pointer (`RSP`), Base Pointer (`RBP`), Instruction Pointer (`RIP`), Flags Register (`RFLAGS` với `ZF`, `CF`, `SF`, `OF`).
    - **ARM64 (AArch64)**: General Purpose Registers (`X0`–`X30`), Stack Pointer (`SP`), Frame Pointer (`X29`), Link Register (`X30` lưu Return Address khi dùng `BL`), Program Counter (`PC`).
  - Phân biệt và vận dụng chuẩn Calling Conventions:
    - **System V AMD64** (Linux/macOS x86_64): 6 tham số nguyên đầu tiên truyền qua `RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9`; giá trị trả về nằm ở `RAX`.
    - **Microsoft x64** (Windows): 4 tham số đầu truyền qua `RCX`, `RDX`, `R8`, `R9`; yêu cầu Shadow Space 32 bytes trên Stack trước mỗi lệnh `CALL`.
    - **ARM64 AAPCS64**: 8 tham số đầu truyền qua `X0`–`X7`; giá trị trả về nằm ở `X0`.
  - Nhận diện Compiler Idioms từ Assembly thô:
    - Cấu trúc rẽ nhánh `if / else`: Cặp lệnh so sánh và nhảy có điều kiện (`CMP` + `JE`, `JNE`, `JG`, `JL`, `JAE` trên x86_64; `CMP` + `B.EQ`, `B.NE` hoặc `CBZ`, `CBNZ` trên ARM64).
    - Cấu trúc `switch / case`: Nhận diện Jump Table (mảng con trỏ địa chỉ nhảy được truy xuất theo index dạng `JMP [RAX*8 + TableBase]`) hoặc chuỗi Binary Search Tree khi số lượng case phân tán.
    - Cấu trúc `struct` và mảng: Nhận diện phép định địa chỉ cơ sở cộng độ dời (Base + Offset: `[RBP - 0x20]`, `[RAX + RCX*4 + 0x10]`). Hiểu rõ Memory Alignment và Data Padding do compiler tự động chèn vào giữa các trường.

### 2. Nắm vững cấu trúc Executable Binary Formats và OS Loader Mechanics

- **Bản chất**: Một file thực thi không phải là khối mã liên tục vô định hình mà tuân thủ định dạng đặc tả nghiêm ngặt (PE/COFF trên Windows, ELF trên Linux/Android, Mach-O trên macOS/iOS, DEX trên Android ART). Hiểu cách OS Loader (ví dụ `ld.so` trên Linux, `ntdll.dll` trên Windows) ánh xạ file từ đĩa vào Virtual Memory Space.
- **Tiêu chuẩn đánh giá**:
  - Cấu trúc phân đoạn và quyền hạn bộ nhớ:
    - Phân biệt rõ các Section tiêu chuẩn: `.text` (mã lệnh thực thi, quyền `r-x`), `.data` (biến toàn cục có khởi tạo, quyền `rw-`), `.rodata` / `.rdata` (hằng số và chuỗi ký tự, quyền `r--`), `.bss` (dữ liệu chưa khởi tạo, chiếm kích thước ảo nhưng không chiếm dung lượng trên file đĩa).
    - Hiểu ý nghĩa các cờ bảo vệ bộ nhớ: NX / DEP (No-Execute / Data Execution Prevention) ngăn chặn thực thi shellcode trên Stack/Heap.
  - Cơ chế nạp động (Dynamic Linking) và định địa chỉ:
    - **Windows PE**: Nắm rõ cấu trúc DOS Header (`MZ`), PE Signature, Optional Header, ImageBase, Relative Virtual Address (RVA), Virtual Address (VA). Phân tích Import Address Table (IAT) và Export Address Table (EAT) để biết nhị phân phụ thuộc vào DLL nào (`kernel32.dll`, `ntdll.dll`).
    - **Linux ELF**: Phân biệt Program Headers (Segment phục vụ Loader) và Section Headers (phục vụ Linker/Debugger). Hiểu luồng Lazy Binding qua Procedure Linkage Table (PLT) và Global Offset Table (GOT) để phân giải địa chỉ hàm từ Shared Libraries (`libc.so`).
    - **Android DEX & APK**: Hiểu cấu trúc file APK (file nén ZIP chứa `classes.dex`, `AndroidManifest.xml`, `resources.arsc`, và thư mục `lib/<abi>/` chứa các `.so` Native Libraries). Nắm cách Dalvik/ART VM tải class và cách JNI (`Java Native Interface`) liên kết hàm `native` thông qua `RegisterNatives` hoặc quy tắc đặt tên `Java_com_example_app_ClassName_methodName`.
  - Hiểu tác động của ASLR (Address Space Layout Randomization) và Base Relocation Table: Địa chỉ các hàm thay đổi ngẫu nhiên mỗi lần thực thi; mọi phân tích tĩnh chỉ cung cấp Relative Offset, bắt buộc cộng với Runtime Module Base Address khi debug hoặc hooking.

### 3. Làm chủ Static Analysis và Decompiler Literacy với Ghidra / IDA Pro / Jadx

- **Bản chất**: Static Analysis là kỹ thuật mổ xẻ mã mà không cần chạy chương trình. Thay vì đọc chay mã máy, kỹ sư sử dụng Decompiler để tái hiện mã nguồn cấp cao, kết hợp phục hồi cấu trúc dữ liệu và điều hướng Control Flow Graph (CFG).
- **Tiêu chuẩn đánh giá**:
  - Nắm rõ giới hạn của Decompiler: Decompiler chỉ tạo ra Pseudocode dựa trên heuristics và Intermediate Representation (P-Code trong Ghidra, microcode trong IDA). Giả mã có thể sai lệch về kiểu dữ liệu, bỏ sót ép kiểu hoặc hiểu sai con trỏ; Assembly luôn là sự thật tuyệt đối (Ground Truth).
  - Kỹ thuật điều hướng và định vị Anchor Points:
    - **String Mining**: Tìm kiếm các chuỗi ký tự giá trị cao (API Endpoints, JSON keys, Error messages, Debug logs, SQL queries) để truy vết ngược Cross-References (XREFs) về hàm xử lý chính.
    - **Import/Export API Tracing**: Xác định các điểm giao tiếp với hệ điều hành (Networking: `connect`, `send`, `HttpSendRequest`; File I/O: `CreateFile`, `fopen`; Crypto: `EVP_EncryptInit`, `BCryptEncrypt`).
  - Kỹ năng tái thiết kế dữ liệu (Type Reconstruction):
    - Đổi tên biến, hàm (từ `FUN_00401230` sang `process_login_packet`).
    - Tạo và gán `struct` mới trong decompiler để biến các biểu thức truy cập bộ nhớ bí ẩn như `*(int *)(param_1 + 0x38)` thành biểu thức tường minh như `param_1->auth_token_length`.

### 4. Kỹ thuật Dynamic Analysis, Debugging và Dynamic Binary Instrumentation (DBI)

- **Bản chất**: Dynamic Analysis là quan sát và can thiệp vào tiến trình khi nó đang hoạt động trong bộ nhớ RAM ([Frida Documentation](https://frida.re/docs/home/)). DBI cho phép chèn mã tùy biến vào tiến trình đang chạy mà không cần biên dịch lại mã nguồn hay chỉnh sửa file nhị phân trên đĩa.
- **Tiêu chuẩn đánh giá**:
  - Làm chủ công cụ Debugger người dùng (User-mode Debuggers: x64dbg, GDB, LLDB):
    - Phân biệt 3 loại Breakpoint cốt lõi:
      - **Software Breakpoint**: Ghi đè byte đầu tiên của lệnh thành opcode `0xCC` (`INT 3` trên x86); bị phát hiện nếu chương trình quét mã tự kiểm tra tính toàn vẹn (Checksum / Integrity Check).
      - **Hardware Breakpoint**: Tận dụng 4 thanh ghi debug của CPU (`DR0`–`DR3` trên x86) để ngắt khi CPU thực thi, đọc hoặc ghi vào một địa chỉ cụ thể mà **không làm thay đổi bất kỳ byte nào trong bộ nhớ**.
      - **Memory Page Guard Breakpoint**: Đổi quyền truy cập của một Memory Page thành `PAGE_GUARD` để bắt mọi thao tác đọc/ghi vào trang nhớ đó.
    - Đọc hiểu Stack Trace, xem giá trị thanh ghi, inspect bộ nhớ Heap và Stack tại điểm ngắt.
  - Làm chủ Dynamic Binary Instrumentation (DBI) với Frida:
    - Sử dụng `Interceptor.attach` để chặn (hook) vào địa chỉ hàm bất kỳ tại thời điểm vào (`onEnter`) và ra (`onLeave`).
    - Đọc và thay đổi tham số hàm (`args[0]`, `args[1]`), đọc cấu trúc con trỏ trong bộ nhớ (`ptr.readUtf8String()`, `ptr.readByteArray()`), và thay thế giá trị trả về (`retval.replace(...)`).
    - Gọi trực tiếp hàm nội bộ của ứng dụng bằng `NativeFunction` mà không cần kích hoạt từ giao diện người dùng.
  - Phân tích và Memory Scanning:
    - Sử dụng công cụ Memory Scanner (Cheat Engine, GameGuardian, GDB `find`) để tìm kiếm giá trị thay đổi trong Heap.
    - Truy vết Pointer Chains qua các lần cấp phát động để tìm Static Base Pointer.

### 5. Bóc tách Network Protocols, Data Serialization và Vượt qua Cơ chế Phòng thủ cơ bản

- **Bản chất**: Mọi ứng dụng phân tán hiện đại đều giao tiếp qua mạng và sử dụng các tầng bảo vệ để ngăn chặn việc soi xét luồng dữ liệu. Kỹ sư phải có khả năng giải mã các tầng mã hóa truyền thông và đối phó với cơ chế chống dịch ngược căn bản.
- **Tiêu chuẩn đánh giá**:
  - Phân tích giao thức mạng và Traffic Interception:
    - Dựng Man-in-the-Middle (MITM) Proxy (mitmproxy, Burp Suite) qua chế độ Proxy hoặc Transparent/WireGuard mode.
    - Hóa giải cơ chế TLS / SSL Certificate Pinning: Hiểu cơ chế ứng dụng từ chối CA do người dùng cài đặt; viết Frida script để hook trực tiếp vào các hàm xác thực chứng chỉ (`SSL_set_custom_verify` trong OpenSSL/BoringSSL, `TrustManagerImpl` hoặc `CertificatePinner` trong Android/OkHttp) để ép buộc kết nối luôn hợp lệ.
  - Nhận diện và giải mã Serialization Formats:
    - Nhận diện các định dạng dữ liệu tuần tự hóa phổ biến: Protocol Buffers (Protobuf), FlatBuffers, MessagePack, Binary JSON (BSON), hoặc Custom Encrypted Blobs (AES-GCM, ChaCha20 kết hợp HMAC).
    - Biết trích xuất Protobuf Schema (`.proto`) từ chuỗi metadata hoặc từ code client để biên dịch lại cấu trúc message hoàn chỉnh.
  - Nhận diện và hóa giải các cơ chế Anti-Reverse Engineering:
    - **Anti-Debugging**: Phát hiện cờ `IsDebuggerPresent` / PEB `BeingDebugged` trên Windows; phát hiện `ptrace(PTRACE_TRACEME, ...)` trên Linux/Android; phát hiện timing checks bằng lệnh `RDTSC`.
    - **Root / Integrity Detection**: Nhận diện các hàm kiểm tra thư mục `/system/bin/su`, kiểm tra môi trường test-keys, hoặc quét port 27042 (cổng mặc định của `frida-server`).
    - **Bypass**: Dùng Frida hoặc binary patching (sửa lệnh điều kiện `JNE` thành `NOP` hoặc `JMP`) để vô hiệu hóa toàn bộ nhánh kiểm tra an ninh trước khi đào sâu vào logic nghiệp vụ.

---

## Phần 2: Phương pháp 80/20 (Pareto) để học Reverse Engineering

- **Mục tiêu 80/20:** làm chủ 80% năng lực thực chiến (bóc API, phân tích phần mềm, viết công cụ tương thích, modding/patching, phân tích mã độc cơ bản) bằng 20% công sức.
- **Cách làm:** tập trung dứt điểm vào 5 khối kiến thức trọng tâm và tạm gác các lĩnh vực chuyên biệt cao cấp.

```text
┌────────────────────────────────────────────────────────────────────────┐
│             20% CỐT LÕI (Đem lại 80% năng lực thực chiến)              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Assembly & Calling Conventions: x86_64, ARM64, Stack Frames, Flags  │
│ 2. Binary Formats: PE, ELF, DEX, Sections, IAT/PLT, Memory Mapping     │
│ 3. Static Recon: Ghidra, Jadx, Strings, Cross-References (XREFs), CFG   │
│ 4. Dynamic Instrumentation: Frida Hooks, x64dbg/GDB, Memory Scanning   │
│ 5. Network & Defense: MITM, TLS Unpinning, Protobuf, Anti-Debug Bypass │
└────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼ (Gác lại tra cứu khi gặp bài toán đặc thù - 80%)
┌────────────────────────────────────────────────────────────────────────┐
│ Viết Decompiler/Disassembler Engine từ đầu (AST parsing, SSA form)     │
│ Phá giải Packer ảo hóa chuyên dụng (VMProtect, Denuvo, Themida deep VMs)│
│ Khai thác lỗ hổng Kernel Rootkit, Hypervisor Escapes, Ring-0 Drivers   │
│ Kỹ thuật dịch ngược phần cứng vật lý (JTAG, UART probing, Chip-off)    │
│ Học thuộc bảng mã Opcode hex thô của toàn bộ vi xử lý Intel/AMD/ARM    │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Khối 1: Computer Architecture & Assembly Idioms (x86_64 và ARM64)

Nắm vững mô hình phân bổ bộ nhớ hàm và cách dữ liệu di chuyển giữa thanh ghi và Stack:

- **Stack Frame Layout**:
  - Khi một hàm được gọi qua `CALL`, CPU đẩy `RIP` tiếp theo vào đỉnh Stack.
  - Prolog của hàm: Lưu `RBP` cũ và cấp phát vùng nhớ cục bộ:
    ```nasm
    push    rbp
    mov     rbp, rsp
    sub     rsp, 0x20       ; Cấp phát 32 bytes cho biến cục bộ
    ```
  - Epilog của hàm: Khôi phục Stack và quay về:
    ```nasm
    mov     rsp, rbp
    pop     rbp
    ret                     ; Pop Return Address từ Stack nạp vào RIP
    ```
- **So sánh trực quan C vs Assembly x86_64**:
  ```c
  int check_key(int input) {
      if (input == 1337) return 1;
      return 0;
  }
  ```
  Tương đương mã Assembly (System V Calling Convention, tham số nằm trong `EDI`):
  ```nasm
  check_key:
      cmp     edi, 0x539      ; 1337 dưới dạng Hex là 0x539
      jne     .fail_branch
      mov     eax, 1          ; Giá trị trả về: 1
      ret
  .fail_branch:
      xor     eax, eax        ; Gán EAX = 0 (tối ưu hơn mov eax, 0)
      ret
  ```

### 2. Khối 2: Executable Formats & Memory Layout (PE, ELF, DEX)

Nắm vững cách hệ điều hành tổ chức một tiến trình đang chạy trong bộ nhớ:

- **Mô hình Virtual Memory Space**:
  - Khi chương trình khởi chạy, OS Loader tạo một Virtual Address Space riêng biệt cho tiến trình (cô lập hoàn toàn với các tiến trình khác).
  - Loader đọc cấu trúc Header, cấp phát các trang nhớ (Memory Pages, thường có kích thước 4 KB), sao chép các Section tương ứng vào trang nhớ và thiết lập cờ quyền hạn truy cập (Read, Write, Execute).
- **Phân biệt định dạng theo nền tảng**:
  - **PE (Portable Executable)**: Nền tảng Windows (`.exe`, `.dll`, `.sys`). Điểm cốt lõi cần soi: `IMAGE_IMPORT_DESCRIPTOR` để liệt kê các DLL và hàm API được gọi; `IMAGE_EXPORT_DIRECTORY` để xem các hàm công khai.
  - **ELF (Executable and Linkable Format)**: Nền tảng Linux, BSD, Android Native (`.elf`, `.so`). Điểm cốt lõi cần soi: Bảng ký hiệu Dynamic Symbols (`.dynsym`), bảng tái định vị (`.rela.plt`, `.rela.dyn`), và bảng ánh xạ chuỗi (`.dynstr`).
  - **DEX (Dalvik Executable)**: Nền tảng Android ART. Chứa mã bytecode của toàn bộ class Java/Kotlin. Cấu trúc gồm `string_ids`, `type_ids`, `proto_ids`, `field_ids`, `method_ids`, và mảng byte bytecode của từng phương thức.

### 3. Khối 3: Static Analysis & Control Flow Decompilation (Ghidra, Jadx)

Quy trình chuẩn hóa để phân tích một binary bí ẩn mà không bị lạc trong biển code:

- **Bước 1: Triage & Metadata Identification**:
  - Dùng công cụ `file` và `strings` trên Linux hoặc DiE (Detect It Easy) trên Windows để nhận diện kiến trúc CPU, compiler (GCC, Clang, MSVC, Go, Rust), và kiểm tra binary có bị Packed bằng UPX hay Obfuscated không.
- **Bước 2: Nạp vào Decompiler và Phân tích tự động**:
  - Dùng **Ghidra** cho Native Binaries (C/C++, Go, Rust, Objective-C, Swift).
  - Dùng **Jadx-GUI** cho Android APK / DEX (cho phép đọc trực tiếp mã Java gần như nguyên bản).
  - Chờ quá trình Auto-Analysis hoàn tất để sinh Cross-References và Call Graph.
- **Bước 3: Phương pháp "Tìm neo và lần ngược" (Anchor & Trace Back)**:
  - Không đọc từ hàm `main()` hoặc `entrypoint` nếu chương trình quá lớn.
  - Tìm chuỗi thông báo lỗi (ví dụ `"Login failed"`, `"Invalid License Key"`, `"Signature verification error"`).
  - Nhấp chuột phải chọn **Show References to Address** để tìm hàm nào đang tham chiếu tới chuỗi đó.
  - Phân tích nhánh điều kiện `if (...)` ngay trước thông báo lỗi để tìm ra hàm kiểm tra logic thật sự.

### 4. Khối 4: Dynamic Instrumentation & Runtime Tampering (Frida, GDB, x64dbg)

Sử dụng Frida làm "con dao mổ điện tử" để can thiệp vào bộ nhớ chương trình theo thời gian thực:

- **Sức mạnh của Frida**: Inject Google V8 JavaScript Engine vào tiến trình đích, cho phép tương tác trực tiếp với Native C Memory, Java Runtime (Android ART), hoặc Objective-C Runtime (iOS).
- **Mẫu Interception Template căn bản của Frida**:
  ```javascript
  // Lấy địa chỉ cơ sở của module nhị phân đang chạy (xử lý ASLR)
  const moduleBase = Module.findBaseAddress("libnative_core.so");
  // Offset của hàm cần can thiệp lấy từ Ghidra (ví dụ offset: 0x12a40)
  const targetAddress = moduleBase.add(0x12a40);

  Interceptor.attach(targetAddress, {
    onEnter: function (args) {
      console.log("[+] Hàm được gọi!");
      console.log("    Tham số 1 (Pointer): " + args[0]);
      console.log("    Chuỗi tham số 1: " + Memory.readUtf8String(args[0]));
      console.log("    Tham số 2 (Int): " + args[1].toInt32());
      // Lưu con trỏ vào context để dùng ở onLeave nếu cần
      this.arg0 = args[0];
    },
    onLeave: function (retval) {
      console.log("[+] Hàm kết thúc! Return value ban đầu: " + retval);
      // Ghi đè giá trị trả về thành 1 (thành công)
      retval.replace(ptr(1));
      console.log("[*] Đã ép giá trị trả về thành: 1");
    },
  });
  ```
- **Mẫu Frida Hook Java trên Android**:
  ```javascript
  Java.perform(function () {
    const SecurityManager = Java.use("com.example.app.SecurityManager");
    // Hook phương thức checkLicense(String key)
    SecurityManager.checkLicense.implementation = function (key) {
      console.log("[*] checkLicense được gọi với key: " + key);
      // Bỏ qua logic gốc, luôn trả về true
      return true;
    };
  });
  ```

### 5. Khối 5: Network Traffic & Data Serialization Reversing

Quy trình bóc tách toàn diện API và Protocol của một ứng dụng client:

- **Bước 1: Traffic Interception**:
  - Cấu hình proxy trung gian (mitmproxy).
  - Chạy Frida script bypass TLS Pinning chuẩn quốc tế (ví dụ universal SSL unpinning scripts trên Frida CodeShare).
- **Bước 2: Phân loại gói tin và Payload**:
  - **REST / JSON thông thường**: Soi trực tiếp headers, query parameters, request body.
  - **Protobuf / Binary Payload**: Nếu gói tin chứa chuỗi nhị phân không đọc được, lấy raw byte đưa qua `protoc --decode_raw` để phân tích cấu trúc các field (tag number, wire type).
- **Bước 3: Lần ngược thuật toán sinh Request Signature**:
  - Hầu hết các ứng dụng có cơ chế chống gian lận API đều đính kèm một header kiểm tra (ví dụ `X-Sign`, `X-Timestamp`, `X-Token`).
  - Dùng Ghidra/Jadx tìm kiếm tên header `"X-Sign"`.
  - Phân tích hàm sinh chữ ký: Thông thường là `HMAC_SHA256(SecretKey, Method + Path + Body + Timestamp)`.
  - Dùng Frida hook vào hàm mã hóa để dump `SecretKey` tại thời điểm runtime.
  - Sau khi có công thức và Secret Key, viết lại một script Python độc lập để tự động tạo request hợp lệ mà không cần mở ứng dụng client.

---

## Practical Implementation: Lộ trình Học Thực chiến

Lộ trình 4 bước được thiết kế theo mô hình **Hands-on Lab**, đi từ cấp độ cô lập trên máy cá nhân đến việc phân tích các ứng dụng đời thực:

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Bước 1: Lab &   │────▶│ Bước 2: Keygen & │────▶│ Bước 3: Android │────▶│ Bước 4: Full    │
│ Basic Crackme   │     │ Binary Patching  │     │ & Frida DBI     │     │ Protocol Unpack │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └─────────────────┘
```

### Bước 1 (2–3 ngày): Thiết lập Môi trường, Assembly Căn bản và Simple Crackme

- **Mục tiêu**: Xây dựng môi trường phân tích nhị phân hoàn chỉnh, làm quen với Assembly và kỹ thuật bẻ gãy nhánh điều kiện kiểm tra mật khẩu.
- **Thiết lập công cụ**:
  - Máy chủ ảo Linux (Arch Linux / Ubuntu) hoặc WSL2.
  - Cài đặt **Ghidra** (yêu cầu JDK 17/21).
  - Cài đặt **GDB** kết hợp plugin nâng cao giao diện: **GEF** (`bash -c "$(curl -fsSL https://gef.blah.cat/sh)"`) hoặc **Pwndbg**.
  - Trên Windows: Cài đặt **x64dbg** và **Detect It Easy (DiE)**.
- **Bài tập thực hành 1**:
  - Tự viết một chương trình C nhỏ kiểm tra mật khẩu:
    ```c
    #include <stdio.h>
    #include <string.h>
    int main(int argc, char *argv[]) {
        if (argc < 2) return 1;
        if (strcmp(argv[1], "SecretPass2026") == 0) {
            printf("Access Granted!\n");
        } else {
            printf("Access Denied!\n");
        }
        return 0;
    }
    ```
  - Biên dịch ở 2 chế độ:
    - Debug có symbols: `gcc -O0 -g pass.c -o pass_debug`.
    - Strip symbols và tối ưu: `gcc -O2 -s pass.c -o pass_release`.
  - Mở cả hai file bằng Ghidra và GDB: So sánh sự biến mất của tên hàm, cách compiler inline hàm `strcmp` thành chuỗi lệnh so sánh byte, và cách phân biệt biến cục bộ.
- **Bài tập thực hành 2**:
  - Truy cập [Crackmes.one](https://crackmes.one/), tải về 2 bài crackme ở độ khó 1 (Difficulty 1, Linux hoặc Windows).
  - Dùng Ghidra tìm logic kiểm tra. Dùng x64dbg hoặc GDB đặt breakpoint tại lệnh `CMP`, quan sát thanh ghi và thực hiện thao tác **Binary Patching**: Thay đổi lệnh nhảy có điều kiện (`JNE` thành `JE`, hoặc chuyển thành lệnh rỗng `NOP` `0x90`) rồi lưu file nhị phân mới đã được bẻ khóa thành công.

### Bước 2 (3–4 ngày): File Formats, Data Structures Recovery và Viết Keygen

- **Mục tiêu**: Nắm vững cấu trúc PE/ELF Headers, hiểu cách cấu trúc dữ liệu lưu trong bộ nhớ và tự viết script Keygen.
- **Thực hành bóc tách File Header**:
  - Chạy `readelf -h -S -l <binary>` trên Linux để phân tích từng Section Header và Program Header.
  - Dùng **PE-bear** hoặc **CFF Explorer** trên Windows để khảo sát Import Address Table (IAT) của một ứng dụng thực tế. Quan sát cách địa chỉ hàm Win32 API được Loader điền vào IAT khi nạp.
- **Bài tập Keygenning**:
  - Chọn một challenge trên Crackmes.one có logic sinh Serial Key dựa trên Username (chuỗi biến đổi toán học: đảo chuỗi, XOR với mảng byte hằng số, băm modulo).
  - Sử dụng Ghidra Decompiler để phục hồi thuật toán biến đổi.
  - Thay vì patch file nhị phân, viết một script bằng **Python** nhận vào chuỗi Username bất kỳ và tính toán chính xác chuỗi Serial Key tương ứng:
    ```python
    def generate_serial(username: str) -> str:
        key = []
        for i, ch in enumerate(username):
            transformed = (ord(ch) ^ 0x5A) + (i * 7)
            key.append(f"{transformed:02X}")
        return "-".join(key)

    print("Serial:", generate_serial("reverse_engineer"))
    ```
  - Nạp Serial vừa sinh vào phần mềm để xác nhận đăng ký thành công mà không sửa đổi file gốc.

### Bước 3 (3–4 ngày): Mobile Reverse Engineering với Jadx và Frida Instrumentation

- **Mục tiêu**: Làm chủ quy trình phân tích ứng dụng di động (Android APK), làm việc với Java kết hợp C/C++ Native Library qua JNI, và viết Frida script để can thiệp bộ nhớ khi đang chạy.
- **Thiết lập công cụ**:
  - Cài đặt **Jadx-GUI** trên máy tính: `jadx-gui`.
  - Chuẩn bị một thiết bị Android đã Root hoặc máy ảo Android (Waydroid, Genymotion, Android Studio Emulator with Root).
  - Cài đặt công cụ Frida CLI: `pip install frida-tools`.
  - Tải binary `frida-server` tương ứng với kiến trúc thiết bị (arm64 hoặc x86_64), đẩy vào thiết bị qua ADB và chạy với quyền root:
    ```bash
    adb root
    adb push frida-server /data/local/tmp/
    adb shell "chmod 755 /data/local/tmp/frida-server && /data/local/tmp/frida-server &"
    ```
- **Thực hành phân tích APK**:
  - Mở một file APK mẫu bằng Jadx-GUI:
    - Khảo sát file `AndroidManifest.xml` để xác định các Activity khởi động, exported components và permissions.
    - Tìm kiếm các chuỗi nhạy cảm: URL API, Token, Encryption Keys.
    - Nhận diện các hàm khai báo `public native ...` gọi vào thư viện `.so`.
  - Trích xuất file `.so` từ APK, nạp vào Ghidra để phân tích hàm Native tương ứng (tìm hàm qua bảng `JNI_OnLoad` hoặc tên chuẩn `Java_com_...`).
- **Thực hành Dynamic Hooking**:
  - Viết Frida script chặn và in ra giá trị giải mã của hàm xử lý:
    ```bash
    frida -U -f com.target.app -l hook.js --no-pause
    ```
  - Thực hành hook vượt qua TLS Certificate Pinning của thư viện mạng phổ biến (OkHttp 3/4).

### Bước 4 (3–4 ngày): Network Protocol Reversing & Full API Reconstruction

- **Mục tiêu**: Kết hợp toàn bộ kỹ năng Static Analysis, Dynamic Hooking và Network Inspection để bóc tách một giao thức truyền thông bí mật, giải mã payload và xây dựng client độc lập.
- **Quy trình triển khai**:
  - **Khởi động MITM Proxy**:
    - Chạy `mitmproxy -p 8080 --web-port 8081` hoặc mở giao diện `mitmweb`.
    - Cấu hình proxy trên điện thoại/máy ảo trỏ về IP máy trạm.
  - **Vượt qua TLS Pinning**:
    - Tiêm script Frida để vô hiệu hóa kiểm tra chứng chỉ SSL/TLS trên client.
    - Quan sát luồng HTTP/HTTPS requests xuất hiện trên giao diện Web của mitmproxy.
  - **Phân tích Cơ chế Chống Giả mạo (Integrity & Anti-Tamper)**:
    - Bắt một request gửi dữ liệu lên server có header bảo vệ: `X-Sign: 8f4b2c...`.
    - Thử sửa một ký tự trong Request Body rồi Replay request: Server trả về mã lỗi `403 Forbidden` hoặc `400 Invalid Signature`. Điều này chứng minh server kiểm tra tính toàn vẹn thông qua chữ ký số.
  - **Lần vết và Bóc tách Thuật toán Ký**:
    - Dùng Jadx hoặc Ghidra tìm chuỗi `"X-Sign"`.
    - Tìm thấy đoạn mã ghép nối các trường: `data_to_sign = url_path + timestamp + request_body + salt_secret`.
    - Dùng Frida hook vào hàm mã hóa để trích xuất giá trị `salt_secret` đang lưu trong RAM.
  - **Xây dựng Replay Client Độc lập**:
    - Viết script Python mô phỏng toàn bộ logic của client: Tự động tạo timestamp, sinh chuỗi ký `X-Sign`, mã hóa payload và gửi HTTP POST request bằng thư viện `requests` hoặc `httpx`.
    - Xác nhận script nhận được phản hồi thành công (`200 OK`) từ máy chủ mà không cần chạy ứng dụng gốc.

---

## Related Notes

- [[Stack_vs_Heap_Memory_Fundamentals]]
- [[Process_vs_Thread_Memory_Model]]
- [[Client_Side_Encryption]]
- [[Linux_Roadmap]]
- [[Redis_Roadmap]]
- [[Master_Backend_Engineering_SSOT]]
- [[000_Tech_MOC]]
- [[000_Methods_MOC]]
