# swimAD 深度研究记录（2026-02-12）

## 仓库
- Repo: `https://github.com/boogieLing/swimAD`
- 语言占比（GitHub API）:
  - Python: `1,875,421`
  - HTML: `96,065`

## 核心定位
- 多视角泳池监测与溺水风险告警系统。
- 目标链路：`视频源 -> YOLO检测 -> 多视角融合 -> 轨迹生命周期 -> 规则判定 -> 事件推送/落盘`。

## 架构主链路（代码证据）
- 入口与服务：
  - `main.py`：Tornado 启动，监听 `ws://localhost:8888/video`。
  - `server.py`：
    - WebSocket：`/video`、`/associate`、`/alert`
    - HTTP：`/source`（视频源增删查）
- 帧处理：
  - `processor.py`：
    - `FrameProcessor` 读取 RTSP/本地视频
    - `FrameDealer` 执行 YOLO 推理（类过滤 `[1, 2]`），并将检测结果送入融合流
- 多视角关联：
  - `swim/trace.py`：
    - `MultiViewAssociationStream`
    - 4 视角到主视角的单应映射（Homography）
    - 使用 `region_calibration_data_v2.json` 做区域/投影相关参数
- 轨迹生命周期：
  - `components/track_lifecycle.py`：
    - tracker 初始化为 `ocsort`
    - 通过 `history_observations[-1]` 与当前检测 key 做 track_id 回填
  - `components/track_window_manager.py`：
    - 轨迹滑动窗口、TTL 过期清理、定时快照
    - JSONL 双通道日志 + snapshot scheduler
- 规则告警：
  - `components/drowning_detector.py`：
    - 9 条规则评估（rule_1 ~ rule_9）
    - `required_rule_count` 门槛 + `drop_event` 单独触发开关
  - `associate/associate.py`：
    - `check_drowning_alerts` 中有告警节流（默认 10s）
    - 事件ID贯穿：accept -> queue -> push -> finish
  - `associate/alert.py`：
    - 推送到外部接口，并记录 push_ok/push_fail
- 事件日志：
  - `components/event_logger.py`：
    - 异步 JSONL 事件日志（默认 `./logs/alert_events.jsonl`）

## 关键配置（代码证据）
- `config/drowning.yaml`（规则参数）：
  - `required_rule_count: 5`
  - `enable_drop_event_single: true`
  - 各规则阈值可配置（头部水下比例、速度/加速度、方向变化、路径比等）
- `config/tracker.yaml`（轨迹生命周期）：
  - `max_window_size: 30`
  - `frame_window_span: 30`
  - `ttl: 10`
  - `snapshot_interval: 30`

## 技术标签提炼（用于简历/项目卡）
- `Python` / `OpenCV` / `Ultralytics` / `Torch`
- `Tornado + WebSocket`
- `Multi-view Homography Association`
- `BoxMOT + OCSORT`
- `Rule-based Risk Detection (9 rules)`
- `Event ID Pipeline + JSONL Auditing`

