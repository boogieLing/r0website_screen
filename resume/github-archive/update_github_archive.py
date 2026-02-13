#!/usr/bin/env python3
"""Refresh GitHub repository archive for boogieLing.

Usage:
    python3 resume/github-archive/update_github_archive.py
"""

import datetime
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

USER = 'boogieLing'
OUT_DIR = Path(__file__).resolve().parent

API_HEADERS = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'r0website-screen-analyzer',
}

STACK_RULES = [
    ('Go', ['go', 'gin', 'gorm', 'grpc', 'go-zero', 'golang']),
    ('Python', ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'scikit', 'sklearn']),
    ('JavaScript', ['javascript', 'node', 'react', 'vue', 'vite', 'webpack', 'html5']),
    ('C++', ['c++', 'cpp', 'opencv', 'qt']),
    ('Redis', ['redis']),
    ('MongoDB', ['mongo', 'mongodb']),
    ('Elasticsearch', ['elasticsearch', 'es ']),
    ('Docker', ['docker']),
    ('Kubernetes', ['kubernetes', 'k8s']),
    ('LLM/AIGC', ['llm', 'rag', 'langchain', 'text2sql', 'prompt', 'aigc', 'diffusion', 'clip']),
    ('推荐系统', ['recommend', 'reco', 'ranking', 'recall', 'ctr', 'cvr', 'feed']),
    ('自动化脚本', ['script', 'automation', 'automatic', 'sign']),
    ('Web前端', ['frontend', 'h5', 'css', 'ui']),
    ('系统/OS', ['os ', 'fifo', 'lru', 'scheduler']),
    ('物联网/嵌入式', ['arduino', 'zigbee', 'i2c', 'iot']),
]

OPT_RULES = [
    ('性能优化', ['optimiz', 'performance', 'latency', 'throughput', 'cache', 'bitmap', 'index', 'wal', 'snapshot']),
    ('可靠性优化', ['reliab', 'recovery', 'crc', 'durable', 'fault', 'retry']),
    ('工程效率优化', ['automation', 'auto', 'pipeline', 'tool', 'workflow', 'ci/cd']),
    ('体验优化', ['ui', 'interaction', 'cursor', 'animation', 'ux']),
    ('算法效果优化', ['ranking', 'recall', 'precision', 'model', 'recommend', 'rl', 'causal']),
]


def get_json(url, headers=None, timeout=20):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode('utf-8', errors='ignore'))


def get_text(url, headers=None, timeout=20):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode('utf-8', errors='ignore')


def list_repos(user):
    repos = []
    page = 1
    while True:
        arr = get_json(f'https://api.github.com/users/{user}/repos?per_page=100&page={page}', headers=API_HEADERS)
        if not arr:
            return repos
        repos.extend(arr)
        page += 1


def fetch_readme(repo):
    if repo.get('fork'):
        return ''
    owner = repo['owner']['login']
    name = repo['name']
    branch = repo.get('default_branch') or 'main'
    candidates = ['README.md', 'readme.md', 'README.MD', 'README', 'README_cn.md', 'README_EN.md']
    for filename in candidates:
        url = f'https://raw.githubusercontent.com/{owner}/{name}/{branch}/{filename}'
        try:
            text = get_text(url, headers={'User-Agent': API_HEADERS['User-Agent']})
            if text and '404: Not Found' not in text[:80]:
                return text[:30000]
        except (urllib.error.URLError, TimeoutError):
            continue
    return ''


def fetch_languages(repo):
    if repo.get('fork'):
        return {}
    try:
        return get_json(repo['languages_url'], headers=API_HEADERS)
    except (urllib.error.URLError, TimeoutError):
        return {}


def infer_role(repo):
    name = repo['name'].lower()
    if repo.get('fork'):
        return '上游开源仓库的学习/实验分支，用于吸收能力并迁移到个人项目。'
    if 'website' in name or 'blog' in name or 'github.io' in name:
        return '个人站点/前端展示项目。'
    if 'server' in name or 'api' in name or 'gin' in name:
        return '后端服务或接口工程。'
    if 'redis' in name or 'mongo' in name or 'es' in name:
        return '数据中间件能力验证项目。'
    if 'os' in name or 'fifo' in name or 'lru' in name:
        return '系统基础能力与算法机制实验项目。'
    if 'script' in name or 'sign' in name or 'watcher' in name:
        return '自动化脚本/效率工具项目。'
    if 'radio' in name or 'h5' in name:
        return '前端交互与多媒体页面项目。'
    return '综合工程实践项目，覆盖实际问题建模与实现。'


def infer_stacks(text, repo_lang, languages):
    stacks = []
    if repo_lang:
        stacks.append(repo_lang)
    for key in languages.keys():
        if key not in stacks:
            stacks.append(key)
    for name, keywords in STACK_RULES:
        if any(k in text for k in keywords):
            stacks.append(name)
    uniq = []
    for item in stacks:
        if item and item not in uniq:
            uniq.append(item)
    return uniq[:12]


def infer_opt_points(text, is_fork):
    points = []
    for label, keywords in OPT_RULES:
        if any(k in text for k in keywords):
            points.append(label)
    if not points:
        points = ['代码结构梳理'] if is_fork else ['可维护性提升']
    if is_fork and '上游同步策略' not in points:
        points.append('上游同步策略')
    return points[:5]


def build_record(repo):
    readme = fetch_readme(repo)
    languages = fetch_languages(repo)
    text = '\n'.join(filter(None, [repo.get('description') or '', readme])).lower()
    return {
        'name': repo['name'],
        'full_name': repo['full_name'],
        'url': repo['html_url'],
        'fork': repo['fork'],
        'private': repo['private'],
        'description': repo.get('description') or '',
        'language': repo.get('language'),
        'languages': languages,
        'topics': repo.get('topics') or [],
        'created_at': repo.get('created_at'),
        'updated_at': repo.get('updated_at'),
        'pushed_at': repo.get('pushed_at'),
        'stars': repo.get('stargazers_count', 0),
        'watchers': repo.get('watchers_count', 0),
        'size': repo.get('size', 0),
        'role': infer_role(repo),
        'stack': infer_stacks(text, repo.get('language'), languages),
        'optimization_points': infer_opt_points(text, repo.get('fork')),
        'analysis_confidence': '高' if (readme and not repo.get('fork')) else '中',
        'readme_excerpt': re.sub(r'\s+', ' ', (readme or '').strip())[:600],
    }


def write_outputs(user, records):
    now = datetime.datetime.now()
    stamp = now.strftime('%Y%m%d_%H%M%S')
    raw = {
        'user': user,
        'generated_at': now.isoformat(),
        'repo_count': len(records),
        'self_built_count': sum(1 for r in records if not r['fork']),
        'fork_count': sum(1 for r in records if r['fork']),
        'repos': records,
    }

    raw_path = OUT_DIR / f'github_projects_raw_{stamp}.json'
    md_path = OUT_DIR / f'github_projects_analysis_{stamp}.md'
    latest_raw = OUT_DIR / 'github_projects_raw_latest.json'
    latest_md = OUT_DIR / 'github_projects_analysis_latest.md'

    raw_path.write_text(json.dumps(raw, ensure_ascii=False, indent=2), encoding='utf-8')
    latest_raw.write_text(raw_path.read_text(encoding='utf-8'), encoding='utf-8')

    lines = [
        f'# GitHub 项目归档（{user}）',
        '',
        f'- 生成时间：{now.strftime("%Y-%m-%d %H:%M:%S")}',
        f'- 仓库总数：{len(records)}（自建 {raw["self_built_count"]} / Fork {raw["fork_count"]}）',
        '',
        '## 自建项目（重点）',
        '',
    ]

    for repo in [x for x in records if not x['fork']]:
        lines.extend([
            f'### {repo["name"]}',
            f'- 链接：{repo["url"]}',
            f'- 作用：{repo["role"]}',
            f'- 技术栈：{", ".join(repo["stack"]) if repo["stack"] else "待补充"}',
            f'- 可优化点：{", ".join(repo["optimization_points"]) if repo["optimization_points"] else "待补充"}',
            f'- 证据强度：{repo["analysis_confidence"]}',
        ])
        if repo['description']:
            lines.append(f'- 描述：{repo["description"]}')
        if repo['readme_excerpt']:
            lines.append(f'- README 摘要：{repo["readme_excerpt"][:180]}...')
        lines.append('')

    lines.extend(['## Fork / 学习项目（逐项）', ''])

    for repo in [x for x in records if x['fork']]:
        lines.extend([
            f'### {repo["name"]}',
            f'- 链接：{repo["url"]}',
            f'- 作用：{repo["role"]}',
            f'- 技术栈：{", ".join(repo["stack"]) if repo["stack"] else "待补充"}',
            f'- 可优化点：{", ".join(repo["optimization_points"]) if repo["optimization_points"] else "待补充"}',
        ])
        if repo['description']:
            lines.append(f'- 描述：{repo["description"]}')
        lines.append('')

    md_path.write_text('\n'.join(lines), encoding='utf-8')
    latest_md.write_text(md_path.read_text(encoding='utf-8'), encoding='utf-8')

    print(raw_path)
    print(md_path)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    repos = sorted(list_repos(USER), key=lambda r: r.get('pushed_at') or '', reverse=True)
    records = [build_record(repo) for repo in repos]
    write_outputs(USER, records)


if __name__ == '__main__':
    main()
