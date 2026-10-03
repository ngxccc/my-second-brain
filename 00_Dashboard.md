# Master Control Dashboard

## Strategic Compass & Action Hub

> [!IMPORTANT]
> **Strategic Compass & Master Backend SSOT**: [[30_Resources/Methods/Engineering/Master_Backend_Engineering_SSOT.md|Master Backend Engineering SSOT & Roadmap]]
> **Master Roadmaps Index**: [[20_Areas/Learning/Master_Roadmaps_Index.md|Master Roadmaps Dashboard (Linux, Redis, k6, English...)]]
> _Truy cập các tài liệu này để kiểm tra Active Sprint, mục tiêu North Star, và bản đồ toàn bộ lộ trình học tập._

## Quick Navigation Hub

| Tech & Architecture                             | Concepts & Models                                           | Methods & Frameworks                                     | Tag Taxonomy                               |
| :---------------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------------- | :----------------------------------------- |
| [[30_Resources/Tech/000_Tech_MOC.md\|Tech MOC]] | [[30_Resources/Concepts/000_Concepts_MOC.md\|Concepts MOC]] | [[30_Resources/Methods/000_Methods_MOC.md\|Methods MOC]] | [[99_Meta/Tag_Taxonomy_SSOT.md\|Tag SSOT]] |

---

## Recently Created Notes (Auto-Scan)

```dataviewjs
const recentPages = dv.pages('"30_Resources"')
    .sort(p => p.file.ctime, 'desc')
    .slice(0, 15);

dv.table(
    ["Note Title", "Category"],
    recentPages.map(p => [
        p.file.link,
        p.file.folder.replace("30_Resources/", ""),
    ])
);
```
