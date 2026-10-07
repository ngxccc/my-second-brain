# Presentation Script: Should AI Replace Human Programmers?

> **Target Standard**: Stage-ready College / Conference Presentation Script.
> **Tone & Style**: Plain English, conversational, crisp, developer-friendly. Zero academic jargon or filler.
> **Pacing Markers**: `//` indicates a natural breath pause; `[PAUSE]` marks an intentional pause for key points to sink in.

---

## Slide Scripts

### Slide 1: Cover Slide

- **Speaker**: Trần Văn Ngọc
- **Slide Title**: Should AI Replace Human Programmers?
- **Subtitle**: Empirical evidence from Stanford, METR, and 153 million lines of production code
- **Metadata**: Instructor: Ms. Đào Thị Yến Thu | Team: Ngọc, Linh, Bảo, Quân, Đương, Tài, Lam, Nghĩa

#### Presenter Script

> _"Good morning Ms. Thu // and everyone. [PAUSE]_
>
> _I am Văn Ngọc, // and on behalf of our team—including Hoài Linh, // Gia Bảo, // Minh Quân, // Quốc Đương, // Minh Tài, // Duy Lam, // and Thế Nghĩa—// we are excited to explore one of the most defining debates in modern computing: // 'Should AI replace human programmers?' [PAUSE]_
>
> _Instead of speculating on commercial hype or alarmist headlines, // our presentation brings concrete empirical findings // from Stanford University, // METR randomized trials, // and over 153 million lines of production code."_

#### Slide Transition Script

> _"Let's look at our roadmap for today's session."_

#### Vietsub

> _Kính chào cô Thu và toàn thể các bạn. Em là Văn Ngọc, và đại diện cho nhóm gồm 8 thành viên: em, bạn Hoài Linh, Gia Bảo, Minh Quân, Quốc Đương, Minh Tài, Duy Lam và Thế Nghĩa—chúng em xin phép được cùng mọi người làm rõ chủ đề đang thu hút nhiều sự quan tâm nhất hiện nay: Liệu AI có nên thay thế lập trình viên con người? Bài thuyết trình hôm nay hoàn toàn không dựa trên cảm tính hay lời đồn thổi truyền thông, mà đối chiếu trực tiếp các số liệu thực nghiệm khoa học từ Đại học Stanford, thử nghiệm của viện METR và phân tích trên hơn 153 triệu dòng code thực tế._

---

### Slide 2: Agenda (Track 01 Highlight)

- **Speaker**: Trần Văn Ngọc
- **Slide Title**: What we'll cover
- **Active Section**: `[01] The Big Claims` (Will programmers go extinct?)
- **Roadmap**: 01 The Big Claims | 02 The Hidden Cost | 03 The Real Superpower | 04 The Winning Formula

#### Presenter Script

> _"Here is our plan for today. [PAUSE]_
>
> _We divide our investigation into four straightforward chapters. // We start with Part 1: // 'The Big Claims'—testing extreme predictions made by tech executives against actual developer benchmarks."_

#### Slide Transition Script

> _"Let's begin by looking at the bold claims that shook the industry."_

#### Vietsub

> _Đây là 4 phần chính của bài thuyết trình. Chúng em bắt đầu với Phần 1: 'The Big Claims' - Đối chiếu những tuyên bố gây sốc của các lãnh đạo công nghệ với số liệu đo lường thực tế trên lập trình viên._

---

### Slide 3: Extreme Predictions from Tech Leaders

- **Speaker**: Trần Văn Ngọc
- **Slide Title**: Extreme Predictions from Tech Leaders
- **Subtitle**: The death of human coding became the dominant tech narrative in 2024
- **Visuals**: Chân dung & Trích dẫn phát biểu của 2 CEO Big Tech
- **Key Quotes**:
  - Jensen Huang (CEO Nvidia): _"Kids shouldn't learn to code. It's our job to create computers so nobody has to program."_
  - Matt Garman (CEO AWS): _"In 24 months, most developers will not be coding."_

#### Presenter Script

> _"Throughout 2024, // tech leaders made dramatic predictions about the death of human programming. [PAUSE]_
>
> _Jensen Huang, // CEO of Nvidia, // told world leaders that children should stop learning how to code, // claiming AI will do all the programming for us. [PAUSE]_
>
> _A few months later, // Matt Garman, // CEO of AWS, // stated that within 24 months, // most developers will no longer write code. [PAUSE]_
>
> _These bold statements made many people believe human programmers would become obsolete almost overnight. // But what happens when researchers actually put developer productivity to the test?"_

#### Slide Transition Script (Hand-off to Hoài Linh)

> _"To test whether these claims survive scientific scrutiny, // I invite Hoài Linh to walk us through the landmark METR trial."_

#### Vietsub

> _Năm 2024, các lãnh đạo công nghệ vẽ nên viễn cảnh lập trình viên con người sắp tuyệt chủng: CEO Nvidia nói trẻ em không cần học code nữa, CEO AWS tuyên bố hầu hết lập trình viên sẽ không còn gõ code trong 24 tháng tới. Nhưng khi kiểm chứng bằng thử nghiệm khoa học, thực tế hoàn toàn khác. Để xem các số liệu đo lường thực tế, xin mời bạn Hoài Linh trình bày thử nghiệm METR._

---

### Slide 4: METR Randomized Controlled Trial: 2025 vs 2026

- **Speaker**: Nguyễn Hoài Linh
- **Slide Title**: METR Randomized Controlled Trial: 2025 vs 2026
- **Visuals**: Sơ đồ thử nghiệm (`METR_Study_Design_2026.png`) + Biểu đồ tốc độ 3 cột (`METR_Speed_Impact_Slide4.png`)
- **Visual Walkthrough**:
  - Đường kẻ giữa: Mốc 0% lập trình thủ công bằng tay (Human baseline).
  - Cột đỏ (trái): -19% SLOWER (Đầu năm 2025, Cursor & Claude 3.5 làm chậm tiến độ).
  - Cột xanh lá (giữa): +18% FASTER (Cuối 2025 - 2026, Autonomous Agents đảo ngược thế cờ).
  - Cột xanh teal (phải): +4% FASTER (Nhóm mới, bị kéo giảm bởi thiên lệch chọn lọc).
  - Hộp ghi chú đáy: 'The Uber Effect' — 30% đến 50% dev từ chối làm bài nếu cấm AI.
- **Key Finding**: AI makes developers 18% faster today, but creates heavy cognitive dependency ('The Uber Effect').
- **Source**: METR RCT Study (arXiv:2507.09089) & 2026 Follow-up Update (metr.org, Feb 2026)

#### Presenter Script

> _"To test whether AI truly replaces programmers, // researchers at METR ran randomized controlled trials on senior open-source engineers across large repositories. [PAUSE]_
>
> _Look at the three bars on this chart: // the black line in the middle is our human baseline—zero percent, completing tasks completely by hand. [PAUSE]_
>
> _The first red bar represents early 2025: // developers using AI assistants like Cursor and Claude 3.5 were actually **19% SLOWER**. // Why does the bar point down? // Because engineers spent more time reading prompt outputs and debugging subtle AI mistakes than writing clean code directly. [PAUSE]_
>
> _Now look at the middle green bar: // in late 2025 and 2026, // newer autonomous agents reversed the gap, // making experienced engineers **18% FASTER**. // The third bar shows new participants gained **4% speedup**, // though damped by selection bias. [PAUSE]_
>
> _BUT look at the footnote at the bottom: // researchers discovered a psychological trap called **'The Uber Effect'**. // Between 30 and 50% of engineers refused to work if AI was turned off, // saying manual coding felt like being forced to walk across the city after getting used to Uber! // When developers become this addicted to AI, // what happens to code quality?"_

#### Slide Transition Script

> _"That brings us directly to Part 2: // The Hidden Cost."_

#### Vietsub

> _Để kiểm chứng AI có thay thế được dev không, Viện METR đã đo giờ thực nghiệm trên các kỹ sư kỳ cựu với dự án lớn. Nhìn vào biểu đồ 3 cột này: đường kẻ đen ở giữa là mốc lập trình thủ công (0%). Cột màu đỏ đầu tiên đầu năm 2025 cắm xuống âm 19%: dev dùng AI bị CHẬM HƠN 19% vì mất quá nhiều thời gian đọc code AI sinh ra và đi sửa lỗi vặt. Sang năm 2026 ở cột xanh lá giữa, các agent tự động mới giúp dev NHANH HƠN 18%, và nhóm mới nhanh hơn 4%. Nhưng nhìn vào dòng ghi chú bên dưới: các nhà nghiên cứu phát hiện ra 'Hiệu ứng Uber'. 30% đến 50% dev từ chối làm bài nếu bị cấm dùng AI, vì quen ỷ lại, cảm giác như đã quen đi xe công nghệ mà bắt đi bộ qua thành phố! Vậy khi dev phụ thuộc vào AI đến mức này, chất lượng code sẽ ra sao?_

---

### Slide 5: Agenda (Track 02 Highlight)

- **Speaker**: Nguyễn Hoài Linh
- **Slide Title**: What we'll cover
- **Active Section**: `[02] The Hidden Cost` (Bugs, security, and rework)
- **Roadmap**: 01 The Big Claims | 02 The Hidden Cost | 03 The Real Superpower | 04 The Winning Formula

#### Presenter Script

> _"Moving to Part 2: // 'The Hidden Cost'—bugs, security, and rework. [PAUSE]_
>
> _Typing code fast is completely meaningless if that code breaks in production. // Let's examine what happens to code quality across hundreds of companies."_

#### Slide Transition Script (Hand-off to Gia Bảo)

> _"To uncover how AI impacts software quality in production, // Gia Bảo will present the empirical findings from Stanford and GitClear."_

#### Vietsub

> _Chuyển sang Phần 2: 'The Hidden Cost' - Cái giá phải trả về chất lượng code, lỗi phần mềm và nợ kỹ thuật. Gõ code nhanh vô nghĩa nếu đoạn code đó làm sập hệ thống. Tiếp theo, xin mời bạn Gia Bảo trình bày những con số rủi ro thực tế từ Đại học Stanford và GitClear._

---

### Slide 6: Code Quality Drops, Rework Surges

- **Speaker**: Ngô Gia Bảo
- **Slide Title**: Code Quality Drops, Rework Surges
- **Visuals**: Sơ đồ mẫu (`Stanford_Study_Design_Slide6.png`) + Biểu đồ 3 cột (`Stanford_Metrics_Slide6.png`)
- **Visual Walkthrough**:
  - Cột 1 (trái, xanh dương): **+14% PR Volume** (Khối lượng code tạo ra tăng vọt, tạo cảm giác năng suất ảo).
  - Cột 2 (giữa, đỏ): **-9% Code Quality** (Điểm chất lượng code sụt giảm trên diện rộng).
  - Cột 3 (phải, cam nổi bật): **+160% Rework Load (2.6× Surge)** (Khối lượng công việc đập đi sửa lại tăng gấp 2.6 lần).
  - Dòng ghi chú dưới: Độ biến động chất lượng code tăng gấp 3.6 lần (Quality Variance 3.6×).
- **Key Finding**: AI increases pull request volume by 14% but degrades quality by 9%, surging rework load by 2.6x on human reviewers.
- **Source**: Denisov-Blanch et al., Stanford University (arXiv:2409.15152)

#### Presenter Script

> _"This landmark Stanford University study tracked over 100,000 engineers across 600 companies. [PAUSE]_
>
> _Please look at the three bars on the right: [PAUSE]_
> _The first blue bar shows PR volume jumped by **14%**—developers were shipping code faster than ever. [PAUSE]_
> _HOWEVER, // look at the middle red bar: // overall code quality dropped by **9%**. [PAUSE]_
> _And look at the alarming orange bar on the right: // maintenance rework SURGED by **2.6 times**! [PAUSE]_
>
> _In short: // AI flooded repositories with fast code, // but senior reviewers had to spend more than double the effort cleaning up the mess."_

#### Slide Transition Script

> _"What did this constant copy-pasting do to system architecture over time? Let's check the GitClear findings."_

#### Vietsub

> _Nghiên cứu của Đại học Stanford trên 100,000 kỹ sư tại 600 công ty. Mọi người hãy nhìn vào biểu đồ 3 cột: Cột xanh dương đầu tiên cho thấy số lượng Pull Request tăng 14%—ai cũng tưởng năng suất tăng. Nhưng nhìn sang cột đỏ ở giữa: chất lượng code thực tế GIẢM 9%. Và nguy hiểm nhất là cột cam bên phải: khối lượng việc phải đập đi làm lại TĂNG GẤP 2.6 LẦN! Tóm lại: AI tuôn ra một lượng code khổng lồ rất nhanh, nhưng các reviewer thâm niên phải è cổ ra dọn rác gấp đôi._

---

### Slide 7: Technical Debt: The Collapse of Refactoring

- **Speaker**: Ngô Gia Bảo
- **Slide Title**: Technical Debt: The Collapse of Refactoring
- **Visuals**: Biểu đồ 3 cột GitClear (`GitClear_Metrics_Slide7.png`)
- **Visual Walkthrough**:
  - Cột 1 (đỏ): **Refactoring sụp đổ từ 25% xuống dưới 10%** (Lập trình viên lười tối ưu hóa module).
  - Cột 2 (cam): **Code trùng lặp copy-paste tăng +48%** (Thói quen append thêm code mới của AI).
  - Cột 3 (đỏ sẫm): **Code Churn tăng gấp 2 lần (2.0×)** (Code vừa viết xong bị xóa hoặc đập đi sửa lại trong vòng 14 ngày tăng vọt).
- **Key Finding**: AI encourages append-only copy-paste patterns over modular refactoring, doubling codebase churn within 2 weeks.
- **Source**: GitClear Research (153M+ lines of code)

#### Presenter Script

> _"GitClear analyzed 153 million lines of real production code across thousands of projects. [PAUSE]_
>
> _Look closely at the three columns on this chart: [PAUSE]_
> _The first red bar shows refactoring collapsed from 25% down to **under 10%**. // Engineers stopped restructuring shared code. [PAUSE]_
> _Instead, // look at the middle bar: // copy-pasted duplicate code surged by **48%**. [PAUSE]_
> _And the third bar reveals code churn—lines rewritten or deleted within 14 days—literally **DOUBLED (2.0×)**! [PAUSE]_
>
> _Why? // Because AI models incentivize an 'append-only' habit: // dumping new snippets instead of refactoring existing architecture. // This is accumulating massive technical debt."_

#### Slide Transition Script (Hand-off to Minh Quân)

> _"Beyond degraded architecture, // what about cybersecurity threats? // Minh Quân will walk us through the dangerous Slopsquatting vector."_

#### Vietsub

> _GitClear phân tích hơn 153 triệu dòng code thực tế. Nhìn vào 3 cột trên biểu đồ: Cột 1 cho thấy tỷ lệ refactor (dọn dẹp, tái cấu trúc code) rơi thẳng đứng từ 25% xuống dưới 10%. Thay vào đó, ở cột 2, lượng code copy-paste thừa thãi tăng tới 48%. Và ở cột 3, tỷ lệ Code Churn—tức code vừa viết xong bị xóa hoặc viết lại trong 2 tuần—TĂNG GẤP ĐÔI. Lý do là AI tập cho dev thói quen dán thêm code mới thay vì tối ưu code cũ. Tiếp theo, bạn Minh Quân sẽ phân tích hiểm họa bảo mật Slopsquatting._

---

### Slide 8: Silent Vulnerabilities & Slopsquatting Risks

- **Speaker**: Lê Minh Quân
- **Slide Title**: Silent Vulnerabilities & Slopsquatting Risks
- **Visuals**: Sơ đồ chuỗi tấn công 4 giai đoạn (`Slopsquatting_Flowchart_Slide8.png`)
- **Visual Walkthrough**:
  - Phase 01: **Package Hallucination** (AI tự bịa ra tên thư viện không tồn tại, ví dụ: `express-jwt-auth`).
  - Phase 02: **Slopsquatting Attack** (Hacker phát hiện quy luật và tải package mã độc lên npm/PyPI chiếm tên đó).
  - Phase 03: **Automated Installation** (Dev tin AI, gõ thẳng `npm install express-jwt-auth`).
  - Outcome: **Supply Chain Breach** (Mã độc xâm nhập máy chủ công ty và luồng CI/CD).
- **Key Takeaway**: Controlled experiments show active skepticism cuts security risks by 80%.
- **Source**: Perry et al., Stanford ACM CCS & Snyk Research

#### Presenter Script

> _"In cybersecurity, // passive reliance on AI introduces a dangerous supply chain attack called 'Slopsquatting'. [PAUSE]_
>
> _Follow the four stages on this flowchart: [PAUSE]_
> _In Phase 1, Package Hallucination: // The AI model hallucinates a plausible package name that does not exist—like `express-jwt-auth`. [PAUSE]_
> _In Phase 2, Slopsquatting: // Attackers spot this common hallucination, // craft a malicious package, // and publish it to npm or PyPI under that exact name. [PAUSE]_
> _In Phase 3: // An unsuspecting developer blindly runs `npm install`. [PAUSE]_
> _The Outcome: // A catastrophic supply chain breach—malware infects the company's servers and CI/CD pipelines! [PAUSE]_
>
> _Stanford researchers proved that active developer skepticism cuts these vulnerabilities by 80%."_

#### Slide Transition Script

> _"What happens when developers stop double-checking AI outputs day after day? Let's look at enterprise delivery data."_

#### Vietsub

> _Về an ninh mạng, việc ỷ lại vào AI mở ra hình thức tấn công chuỗi cung ứng gọi là Slopsquatting. Hãy nhìn vào 4 bước trên sơ đồ: Bước 1, AI tự bịa ra một tên package nghe rất hợp lý nhưng không có thật, ví dụ 'express-jwt-auth'. Bước 2, tin tặc phát hiện ra, liền tạo package chứa mã độc và đăng ký đúng tên đó trên npm/PyPI. Bước 3, lập trình viên tin tưởng AI, gõ ngay lệnh npm install vào dự án. Kết quả ở bước cuối cùng: Toàn bộ máy chủ công ty và đường ống CI/CD bị nhiễm độc! Nghiên cứu của Stanford chứng minh: Rà soát chủ động giúp giảm 80% rủi ro này._

---

### Slide 9: The Cost of Blind Reliance: Bugs Surge, Speed Flatlines

- **Speaker**: Lê Minh Quân
- **Slide Title**: The Cost of Blind Reliance: Bugs Surge, Speed Flatlines
- **Visuals**: Biểu đồ đối nghịch 2 bảng Uplevel & DORA (`Uplevel_DORA_Metrics_Slide9.png`)
- **Visual Walkthrough**:
  - Bảng trái (Màu đỏ, Uplevel RCT): **Bug Rate +41%** (Tỷ lệ lỗi trong PR tăng vọt 41%).
  - Bảng phải (Màu xám, DORA 2024): **PR Throughput +0% (Zero Velocity Gain)** (Tốc độ bàn giao thực tế không hề tăng).
  - Chú thích dưới: _Individual typing speed != Organizational delivery velocity_ (Gõ phím nhanh không đồng nghĩa với bàn giao phần mềm nhanh).
- **Key Finding**: Typing code faster does not mean shipping software faster.
- **Source**: Google Cloud DORA & Uplevel 2024

#### Presenter Script

> _"When developers stop thinking critically, // downstream bugs multiply rapidly. [PAUSE]_
>
> _Look at the two contrasting panels on this chart: [PAUSE]_
> _On the left, from Uplevel's study: // Pull requests from developers using AI suffered a **41% surge in bug rate**! [PAUSE]_
> _Now look at the right panel: // Did features reach users any faster? // The net speedup was **EXACTLY ZERO PERCENT**! [PAUSE]_
>
> _Google Cloud's DORA report explains this paradox: // Typing syntax faster at your keyboard does NOT mean shipping software faster. // When code is filled with subtle bugs, // the time saved typing is completely erased by triage, // debugging, // and emergency hotfixes."_

#### Slide Transition Script (Hand-off to Quốc Đương)

> _"To understand how this unchecked cycle leads to production disasters, // Quốc Đương will explain the Production Failure Chain."_

#### Vietsub

> _Khi lập trình viên giảm tư duy phản biện, lỗi bắt đầu nhân lên. Hãy nhìn vào 2 bảng đối chiếu trên màn hình: Bảng màu đỏ bên trái từ nghiên cứu Uplevel cho thấy tỷ lệ bug trong PR tăng tới 41%. Nhưng nhìn sang bảng bên phải từ báo cáo Google DORA: Tốc độ bàn giao phần mềm thực tế tăng bao nhiêu? Bằng đúng 0%! Gõ code nhanh hơn ở bàn làm việc không có nghĩa là công ty release nhanh hơn, vì thời gian gõ nhanh đã bị nuốt chửng bởi thời gian đi tìm và vá lỗi ngầm. Xin mời bạn Quốc Đương tiếp nối với chuỗi sự cố sập hệ thống._

---

### Slide 10: The Production Failure Chain

- **Speaker**: Nguyễn Quốc Đương
- **Slide Title**: The Production Failure Chain
- **Visuals**: Sơ đồ chuỗi sự cố 4 công đoạn (`Production_Failure_Chain_Slide10.png`)
- **Visual Walkthrough**:
  - State 01: **Local Prompt Generation** (AI đoán code cục bộ mà không hiểu kiến trúc hệ sinh thái).
  - State 02: **Superficial Green Tests** (Code vượt qua unit test đơn giản nhưng phá vỡ ràng buộc cơ sở dữ liệu).
  - State 03: **Fatigued Code Review** (Reviewer quá tải, nhìn lướt thấy code đẹp nên bấm Merge).
  - Outcome: **Production Outage at 2 AM** (Hệ thống sập lúc 2h sáng, AI phủi tay vô can, kỹ sư chịu toàn bộ trách nhiệm).
- **Footnote**: Large Language Models have no legal identity and provide zero SLA guarantees.

#### Presenter Script

> _"Here is the complete failure chain visualized across four steps: [PAUSE]_
>
> _In State 1: // AI generates code based on word probabilities, // completely blind to system-wide database constraints. [PAUSE]_
> _In State 2: // The code passes simple unit tests, // creating a false sense of security while breaking core invariants. [PAUSE]_
> _In State 3: // A tired human reviewer skims the clean-looking syntax // and clicks 'Merge'. [PAUSE]_
> _The Outcome: // At 2 AM, the production server crashes! [PAUSE]_
>
> _And look at the crucial legal takeaway at the bottom: // AI models have zero legal identity and provide ZERO SLA guarantees. // When systems fail, // human engineers carry 100% of the liability."_

#### Slide Transition Script

> _"Despite all these risks, // why is AI adoption exploding? // Because when applied to the right tasks, // AI has extraordinary power. Let's enter Part 3."_

#### Vietsub

> _Đây là chuỗi sự cố 4 bước dẫn đến thảm họa vận hành: Bước 1, AI đoán code theo xác suất từ ngữ mà không hiểu ràng buộc toàn hệ thống. Bước 2, code vượt qua unit test cục bộ nhưng âm thầm phá vỡ cấu trúc database. Bước 3, reviewer quá tải thấy cú pháp sáng sủa liền bấm Merge. Kết quả: Nửa đêm 2h sáng server sập! Hãy chú ý dòng dưới cùng: AI không có tư cách pháp nhân và không có cam kết SLA. Khi hệ thống sập, con người phải chịu 100% trách nhiệm. Dù rủi ro như vậy, tại sao AI vẫn phát triển bùng nổ? Chúng ta cùng bước sang Phần 3._

---

### Slide 11: Agenda (Track 03 Highlight)

- **Speaker**: Nguyễn Quốc Đương
- **Slide Title**: What we'll cover
- **Active Section**: `[03] The Real Superpower` (How AI actually saves your time)
- **Roadmap**: 01 The Big Claims | 02 The Hidden Cost | 03 The Real Superpower | 04 The Winning Formula

#### Presenter Script

> _"Turning to Part 3: // 'The Real Superpower'—how AI actually saves your time. [PAUSE]_
>
> _We are not against AI. // On the contrary, // for specific isolated tasks, // AI is an extraordinary accelerator. Let's examine the numbers."_

#### Slide Transition Script (Hand-off to Minh Tài)

> _"To show us where AI truly shines with solid data, // Minh Tài will present the GitHub RCT benchmark and bandwidth reallocation."_

#### Vietsub

> _Chuyển sang Phần 3: 'The Real Superpower' - AI thực sự giúp chúng ta tiết kiệm thời gian ở đâu. Nhóm hoàn toàn không bài trừ AI; trái lại, ở những tác vụ cụ thể, AI là một siêu năng lực thực sự. Tiếp theo, xin mời bạn Minh Tài trình bày các số liệu tăng tốc ấn tượng từ GitHub và Microsoft._

---

### Slide 12: The Real Superpower: Where AI Saves Your Time

- **Speaker**: Lê Minh Tài
- **Slide Title**: The Real Superpower: Where AI Saves Your Time
- **Visuals**: Biểu đồ 2 bảng GitHub RCT (`GitHub_Speedup_Slide12.png`)
- **Visual Walkthrough**:
  - Bảng trái (Thời gian hoàn thành tác vụ Web Server): Cột xám (không có AI) mất **161 phút** $\rightarrow$ Cột xanh lá (có Copilot) chỉ mất **71 phút** (Tiết kiệm **55.8% thời gian**, nhanh hơn **2.26×**).
  - Bảng phải (Độ phân kỳ vận tốc - Velocity Divergence): Cột đỏ (Codebase cũ bảo trì) bị chậm **-19%**, nhưng Cột xanh lá (Dự án mới Greenfield) tăng vọt **+55.8%**.
- **Key Metrics**:
  - Web Server Task Time: 161 mins without AI $\rightarrow$ 71 mins with Copilot (55.8% time saved, 2.26x faster).
  - Velocity Divergence: Legacy Maintenance (-19% slowdown) vs Greenfield Scaffolding (+55.8% speedup).
- **Source**: Peng et al., GitHub / Microsoft Research

#### Presenter Script

> _"In this landmark randomized trial by Microsoft and GitHub, // developers were tasked with building an HTTP web server from scratch. [PAUSE]_
>
> _Look at the two panels on this chart: [PAUSE]_
> _On the left panel: // The gray bar shows developers without AI took **161 minutes**. // But look at the green bar: // with GitHub Copilot, // they finished in just **71 minutes**! // That is nearly **56% time saved**—more than twice as fast! [PAUSE]_
>
> _Now look at the right panel showing the Velocity Divergence: // In complex legacy systems, AI can slow you down by 19%. // But for greenfield projects—scaffolding boilerplate, // CRUD endpoints, // and test harness setup—AI is an unbeatable superpower."_

#### Slide Transition Script

> _"How does this superpower reshape our daily working hours as engineers?"_

#### Vietsub

> _Thử nghiệm của Microsoft và GitHub: Lập trình viên viết một máy chủ web mới từ đầu. Nhìn vào bảng bên trái: Cột màu xám không dùng AI mất 161 phút, nhưng cột màu xanh lá có Copilot chỉ mất 71 phút—tiết kiệm gần 56% thời gian (nhanh hơn gấp 2.2 lần). Nhìn sang bảng phân kỳ bên phải: Với hệ thống cũ phức tạp thì AI gây chậm 19%, nhưng với khởi tạo dự án mới, sinh boilerplate và dựng khung test thì AI phát huy tốc độ vượt trội._

---

### Slide 13: Reallocating Engineering Bandwidth

- **Speaker**: Lê Minh Tài
- **Slide Title**: Reallocating Engineering Bandwidth
- **Visuals**: Sơ đồ đối chiếu 2 mô hình (Truyền thống vs Hiện đại) + Trích dẫn của Martin Fowler & Kent Beck
- **Visual Walkthrough**:
  - Mô hình truyền thống (Creation-oriented): Dành **70% thời gian** gõ cú pháp, tra cứu API, nhớ tên hàm cơ học.
  - Mô hình hiện đại (Supervisory Engineering): Giải phóng thời gian gõ, dành **80% thời gian** cho thiết kế kiến trúc, đánh giá an ninh và tối ưu nghiệp vụ.
  - Câu nói đinh: _"When typing code becomes cheap, the skill of good system design becomes 1,000x more valuable."_
- **Comparison**:
  - Traditional Model (Creation-oriented): 70% time typing syntax and APIs. Most mental energy spent on mechanical boilerplate.
  - Modern Model (Supervisory Engineering): 80% time auditing architecture. System design, security auditing, and problem-solving.
- **Quote**: _"When typing code becomes cheap, the skill of good system design becomes 1,000x more valuable."_ (Kent Beck & Martin Fowler)
- **Source**: Kent Beck & Martin Fowler

#### Presenter Script

> _"Because AI generates repetitive code so quickly, // our daily role as software engineers is undergoing a massive shift. [PAUSE]_
>
> _Look at the contrast between the two models on the slide: [PAUSE]_
> _In the traditional model, // engineers spent up to **70% of their day** on the mechanical act of typing syntax and memorizing APIs. [PAUSE]_
> _In the modern model, // AI absorbs that mechanical typing. // Engineers now shift **80% of their bandwidth** to what truly matters: // system architecture, // security boundaries, // and edge-case validation. [PAUSE]_
>
> _As software pioneers Kent Beck and Martin Fowler stated: // 'When typing code becomes cheap, // the skill of good system design becomes a thousand times more valuable.'"_

#### Slide Transition Script (Hand-off to Duy Lam)

> _"So how do humans and AI collaborate without falling into the traps we saw earlier? // Duy Lam will guide us through Part 4: The Winning Formula."_

#### Vietsub

> _Nhìn vào 2 mô hình trên slide: Trước đây, kỹ sư mất 70% thời gian ngồi gõ cú pháp cơ học và nhớ tên hàm. Ngày nay, AI đảm nhận phần việc gõ phím đó, giúp kỹ sư tái phân bổ 80% năng lượng trí tuệ cho thiết kế kiến trúc hệ thống, kiểm toán an ninh và giải quyết bài toán nghiệp vụ. Đúng như Martin Fowler đã đúc kết: Khi việc gõ code trở nên rẻ, kỹ năng thiết kế kiến trúc tốt càng trở nên đáng giá gấp ngàn lần. Tiếp theo, xin mời bạn Duy Lam trình bày công thức hiệp đồng ở Phần 4._

---

### Slide 14: Agenda (Track 04 Highlight)

- **Speaker**: Đặng Duy Lam
- **Slide Title**: What we'll cover
- **Active Section**: `[04] The Winning Formula` (Human conductor, AI orchestra)
- **Roadmap**: 01 The Big Claims | 02 The Hidden Cost | 03 The Real Superpower | 04 The Winning Formula

#### Presenter Script

> _"We now arrive at Part 4: // 'The Winning Formula'—Human conductor, AI orchestra. [PAUSE]_
>
> _The future is neither human without AI, // nor AI without human. // The winning formula is understanding the fundamental boundary between AI statistics and human engineering."_

#### Slide Transition Script

> _"Let's look at the technical boundary between AI tokens and deterministic logic."_

#### Vietsub

> _Chúng ta bước vào Phần 4: 'The Winning Formula' - Công thức chiến thắng: Con người là nhạc trưởng, AI là dàn nhạc. Tương lai không phải là con người bài trừ AI, cũng không phải AI thay thế con người, mà là cách chúng ta phân định ranh giới kỹ thuật để hợp tác hiệu quả._

---

### Slide 15: Statistical Patterns vs Deterministic Logic

- **Speaker**: Đặng Duy Lam
- **Slide Title**: Statistical Patterns vs Deterministic Logic
- **Visuals**: Bảng đối chiếu 4 khía cạnh kỹ thuật (AI thống kê vs Kỹ sư con người)
- **Visual Walkthrough**:
  - Hàng 1 (Cơ chế cốt lõi): AI đoán từ tiếp theo theo xác suất (`Token Probability`) vs Con người tư duy logic tất định từng bước (`Deterministic Logic`).
  - Hàng 2 (Tầm nhìn bối cảnh): AI nhìn cục bộ ngữ cảnh prompt ngắn hạn vs Con người bao quát kiến trúc toàn hệ thống.
  - Hàng 3 (Thế mạnh): AI mạnh về boilerplate & regex vs Con người mạnh về thiết kế kiến trúc & xử lý ngoại lệ (Edge Cases).
  - Hàng 4 (Trách nhiệm pháp lý): AI hoàn toàn vô can (0% SLA) vs Con người chịu trách nhiệm 100% khi hệ thống sập.
- **Table Structure**:
  - Core Mechanism: Predicts the next most likely word vs Strict step-by-step logic
  - Optimal Scope: Small context in front of it vs The entire big picture & system flow
  - Key Strength: Scaffolding & regex boilerplate vs System design & edge cases
  - Operational Liability: Zero responsibility vs Full accountability when systems break
- **Takeaway**: _"Anyone can generate code. Only software engineers own the system."_

#### Presenter Script

> _"Look at the four comparative rows on this technical divide: [PAUSE]_
>
> _Row 1, Mechanism: // AI predicts the next most likely token based on statistical training weights. // Humans design deterministic, step-by-step logic. [PAUSE]_
> _Row 2, Scope: // AI only sees the local prompt in front of it. // Humans maintain the mental model of the entire system—how distributed databases, cache layers, and business rules interact. [PAUSE]_
> _Row 3, Strength: // AI excels at boilerplate and regex. // Humans excel at architectural trade-offs and edge-case resilience. [PAUSE]_
> _Row 4, Liability: // AI has zero legal standing. // Humans carry full operational ownership. [PAUSE]_
>
> _Remember this principle: // Anyone can generate code. // Only software engineers own the system."_

#### Slide Transition Script (Hand-off to Thế Nghĩa)

> _"How do we translate this divide into real team workflows? // Thế Nghĩa will present our 3-tier framework and deliver our final verdict."_

#### Vietsub

> _Hãy nhìn vào 4 hàng đối chiếu trên slide: Hàng 1, cơ chế: AI đoán chữ theo xác suất thống kê; con người xây dựng logic tất định. Hàng 2, tầm nhìn: AI chỉ thấy prompt trước mắt; con người bao quát toàn bộ hệ thống từ database, cache đến nghiệp vụ. Hàng 3, thế mạnh: AI mạnh ở boilerplate, con người mạnh ở kiến trúc và xử lý ngoại lệ. Hàng 4, trách nhiệm: AI không chịu trách nhiệm gì cả, con người chịu 100% khi hệ thống gặp sự cố. Ai cũng có thể sinh ra code, nhưng chỉ kỹ sư phần mềm mới làm chủ hệ thống. Tiếp theo, xin mời bạn Thế Nghĩa kết luận bài thuyết trình với mô hình tháp 3 tầng._

---

### Slide 16: Human Conductor, AI Orchestra

- **Speaker**: Huỳnh Thế Nghĩa
- **Slide Title**: Human Conductor, AI Orchestra
- **Visuals**: Sơ đồ kim tự tháp 3 tầng (`Tiered_Framework_Slide16.png`)
- **Visual Walkthrough**:
  - Tầng 1 (Đáy tháp, Màu xanh lá): **Mechanical Syntax (80% Automated by AI)** — Tạo khung sườn, sinh CRUD, viết unit test mẫu.
  - Tầng 2 (Thân tháp, Màu vàng hổ phách): **Verification & Security (50/50 Hybrid)** — Rà soát code, quét lỗ hổng Slopsquatting, kiểm thử tích hợp.
  - Tầng 3 (Đỉnh tháp, Màu xanh navy): **Strategy & Ownership (100% Human)** — Thiết kế kiến trúc, cam kết SLA, chịu trách nhiệm vận hành.
- **Tiers**:
  - Tier 1: Mechanical Syntax (Boilerplate & Test Setup) $\rightarrow$ 80% Automated
  - Tier 2: Verification & Security (Code Review & Vulnerability Check) $\rightarrow$ 50 / 50 Hybrid
  - Tier 3: Strategy & Ownership (System Architecture & SLA Liability) $\rightarrow$ 100% Human
- **Takeaway**: _"Human-in-the-Loop: Engineers direct the system instead of typing raw syntax."_

#### Presenter Script

> _"We put this collaboration into practice through a 3-tier pyramid framework: [PAUSE]_
>
> _Look at Tier 1 at the base: // Mechanical syntax. CRUD boilerplate and mock data. // Here, AI automates **80% of the workload**, saving hours of typing. [PAUSE]_
> _Look at Tier 2 in the middle: // Verification and security. Code review, security auditing, and regression checks. // Here, humans and AI work **fifty-fifty as co-pilots**. [PAUSE]_
> _Now look at Tier 3 at the very top: // Strategy and ownership. System architecture, domain decomposition, and SLA liability. // This tier is **ONE HUNDRED PERCENT human**! [PAUSE]_
>
> _The software engineer is the conductor; // AI is the orchestra."_

#### Slide Transition Script

> _"And that brings us to our final conclusion."_

#### Vietsub

> _Mọi người hãy nhìn vào mô hình kim tự tháp 3 tầng trên màn hình: Dưới đáy là Tầng 1 (Màu xanh) - Cú pháp cơ học: sinh code mẫu, dựng khung API, phần này AI tự động hóa 80%. Ở giữa là Tầng 2 (Màu vàng) - Thẩm định và bảo mật: rà soát code, bắt lỗi Slopsquatting, người và AI phối hợp 50/50. Và trên đỉnh tháp là Tầng 3 (Màu xanh navy) - Chiến lược và trách nhiệm: kiến trúc hệ thống, lựa chọn đánh đổi và cam kết SLA, tầng này 100% là con người. Kỹ sư là nhạc trưởng, AI là dàn nhạc._

---

### Slide 17: Strategic Verdict & Conclusion

- **Speaker**: Huỳnh Thế Nghĩa (Chốt hạ & Điều phối Q&A)
- **Slide Title**: Strategic Verdict & Conclusion
- **Visuals**: Thông điệp trung tâm nổi bật (Hero Quote Card)
- **Hero Quote**: _"AI will not replace software engineers. Engineers who master AI will replace those who don't."_
- **Subtext**: Software engineering is the art of managing complexity and owning outcomes for humans.

#### Presenter Script

> _"To conclude our presentation today, // we leave you with one defining truth: [PAUSE]_
>
> _**'AI will not replace software engineers. // Engineers who master AI will replace those who don't.'** [PAUSE]_
>
> _Software engineering has never been just about typing characters into a code editor. // It is the art of managing complexity and owning outcomes for humans. [PAUSE]_
>
> _Embrace AI as your superpower, // but always remain the conductor. [PAUSE]_
>
> _Thank you Ms. Thu and everyone for your time and attention!"_

#### Vietsub

> _Để kết thúc bài thuyết trình hôm nay, nhóm chúng em xin gửi gắm một thông điệp cốt lõi: 'AI sẽ không thay thế kỹ sư phần mềm, nhưng những kỹ sư làm chủ được AI sẽ thay thế những người không chịu học hỏi'. Bản chất của kỹ thuật phần mềm chưa bao giờ chỉ là việc ngồi gõ code vào màn hình, mà là nghệ thuật quản lý độ phức tạp và chịu trách nhiệm về kết quả cho con người. Hãy dùng AI như một siêu năng lực, nhưng hãy luôn giữ vai trò người nhạc trưởng điều phối. Cảm ơn cô và các bạn đã chú ý lắng nghe!._
