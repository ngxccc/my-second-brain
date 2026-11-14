---
tags: [type/concept, status/permanent]
date: 2026-07-04
description: "So sánh các công cụ download torrent CLI thay thế aria2c; qBittorrent-nox là all-rounder hàng đầu cho server headless năm 2026."
---

# Torrent CLI Download Tools Comparison

## TL;DR

- **Bản chất**: So sánh công cụ torrent CLI cho server headless: aria2c là utility đa giao thức, qBittorrent-nox và rTorrent là client đầy đủ.
- **Mục đích**: Chọn đúng công cụ theo use case - media server cần WebUI và API, private tracker cần hiệu năng cao, máy yếu cần cực nhẹ.
- **Điểm mấu chốt**: aria2c thiếu quản lý swarm và peer selection nên không thay được torrent client thật; chọn theo khối lượng seed và nhu cầu tích hợp, không theo benchmark đơn lẻ.

## Core Concept / Rules / Rationales

- **aria2c**: Điểm mạnh là multi-protocol, hỗ trợ Metalink, RPC interface, scripting dễ dàng (dùng như wget/curl cho torrent). Tuy nhiên, là utility chứ không phải full torrent client: swarm management, peer selection, ratio control yếu hơn.
- **qBittorrent-nox**: Phiên bản headless của qBittorrent dùng libtorrent. Điểm mạnh: WebUI responsive hiện đại, built-in search/RSS, API mạnh mẽ, category/tagging, sequential download. Lý tưởng cho media server (Radarr/Sonarr/Prowlarr). Resource usage vừa phải, scale tốt đến ~500 torrents.
- **rTorrent (+ ruTorrent)**: Client ncurses C++ cực kỳ hiệu quả. Xử lý 1000+ torrents với footprint thấp nhất. Hệ sinh thái plugin mạnh (autodl-irssi cho racing). Phù hợp private tracker, seeding volume cao. Config qua ~/.rtorrent.rc phức tạp hơn.
- **Transmission-daemon**: Nhẹ nhất, "set and forget". WebUI cơ bản, resource footprint thấp nhất. Phù hợp NAS/low-power hardware hoặc vài torrents đơn giản. Thiếu advanced features như filtering phức tạp.
- **Quy tắc chọn tool**:
  - Scripting/one-shot/multi-proto → Giữ aria2c hoặc thử tget.
  - Server media automation → qBittorrent-nox.
  - Max performance/private tracker → rTorrent.
  - Minimalist/low-power → Transmission.

## Practical Implementation

**qBittorrent-nox trên server (recommended cho hầu hết trường hợp):**

```bash
# Install & run headless
sudo apt install qbittorrent-nox
qbittorrent-nox --daemon
# Truy cập WebUI tại http://server:8080
```

**rTorrent CLI thuần:**

```bash
# ~/.rtorrent.rc ví dụ cơ bản
directory = ~/torrents
session = ~/.rtorrent/session
schedule = watch_directory,5,5,load_start=~/watch/*.torrent
```

**So sánh nhanh (dựa trên benchmark thực tế 2025-2026):**

- Resource: Transmission < rTorrent < aria2c < qBittorrent-nox
- Features/UX: qBittorrent-nox > rTorrent > Transmission > aria2c (cho torrent)
- Automation: qBittorrent-nox (API/RSS) > rTorrent (plugins) > aria2c (RPC)

## Related Notes

- [[000_Tech_MOC]]
