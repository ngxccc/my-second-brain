---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Mã giả TypeScript mô hình hóa kiến trúc Reactor Pattern của Redis: epollWait, vòng lặp sự kiện, và processCommand."
---

# Mô hình hóa Redis Reactor Pattern bằng TypeScript

## TL;DR

- **Bản chất**: Mô hình hóa Reactor Pattern của Redis bằng TypeScript: `epollWait()` là tầng network, vòng `for` tuần tự là tầng execution.
- **Mục đích**: Nhìn thấy bằng mã vì sao một `processCommand` chậm 500 ms làm treo toàn bộ vòng lặp của mọi Client.
- **Điểm mấu chốt**: `Map` của TypeScript đóng vai `dict.c`, và nhánh `KEYS` chính là ví dụ $O(N)$ làm đóng băng cả Event Loop.

## Mô hình hóa Engine

```typescript
// Mô hình hóa tư duy cho kiến trúc Reactor Pattern của Redis
interface FiredEvent {
  fd: number;
  mask: "READABLE" | "WRITABLE";
}

class RedisServerEngine {
  private inMemoryDict = new Map<string, any>();
  private isRunning = true;

  public async runEventLoop(): Promise<void> {
    while (this.isRunning) {
      // TẦNG 1: NETWORK I/O MULTIPLEXING (epoll_wait)
      // Luồng đi ngủ cho đến khi Kernel báo có dữ liệu ở Socket
      const firedEvents: FiredEvent[] = await this.epollWait();

      // TẦNG 2: EXECUTION LAYER (Single Main Thread)
      // Tuần tự thực thi từng câu lệnh trong danh sách
      for (const event of firedEvents) {
        const rawBytes = this.readSocketBuffer(event.fd);
        const command = this.parseRESPProtocol(rawBytes);

        // THỰC THI TRỰC TIẾP TRÊN RAM (Sub-microsecond)
        // CẢNH BÁO: Nếu hàm này tốn 500ms, toàn bộ vòng lặp for bị treo!
        const response = this.processCommand(command);

        this.writeSocketBuffer(event.fd, response);
      }
    }
  }

  private processCommand(cmd: { name: string; args: string[] }): any {
    switch (cmd.name.toUpperCase()) {
      case "GET":
        return this.inMemoryDict.get(cmd.args[0]) ?? null; // O(1) in RAM
      case "SET":
        this.inMemoryDict.set(cmd.args[0], cmd.args[1]); // O(1) in RAM
        return "OK";
      case "KEYS":
        // NGUY HIỂM: O(N) Scan toàn bộ Map làm đóng băng toàn bộ Event Loop
        return Array.from(this.inMemoryDict.keys());
      default:
        throw new Error("Unknown Command");
    }
  }

  private async epollWait(): Promise<FiredEvent[]> {
    // Gọi xuống syscall epoll_wait(epfd, events, max, timeout) của Linux Kernel
    return [];
  }

  private readSocketBuffer(fd: number): Buffer {
    return Buffer.alloc(0);
  }

  private parseRESPProtocol(buf: Buffer): { name: string; args: string[] } {
    return { name: "GET", args: ["user:1"] };
  }

  private writeSocketBuffer(fd: number, data: any): void {}
}
```

## Đối chiếu với bản C

| Thành phần trong mô hình           | Tương ứng trong `redis-server`                                         |
| :--------------------------------- | :--------------------------------------------------------------------- |
| `epollWait()`                      | Lời gọi syscall `epoll_wait(epfd, events, max, timeout)` trong `ae.c`. |
| `for (const event of firedEvents)` | Vòng lặp `aeMain` xử lý từng Fired Event theo FIFO.                    |
| `inMemoryDict`                     | Hash Table trong `dict.c`, thao tác trung bình $O(1)$ ~50 nano-giây.   |
| `processCommand`                   | Hàm `processCommand(client)` trong `server.c`.                         |
| `parseRESPProtocol`                | RESP Parser đọc lệnh từ Socket Buffer.                                 |

## Related Notes

- Kiến trúc thật của Event Loop: [[Redis_Single_Threaded_Event_Loop_Architecture]]
- Vì sao lệnh $O(N)$ phá vỡ mô hình này: [[Redis_Head_of_Line_Blocking]]
- [[Redis_Roadmap]]
