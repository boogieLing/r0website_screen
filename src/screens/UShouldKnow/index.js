import {useEffect, useMemo, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import ReactDocumentTitle from '@/utils/title';
import globalStore from '@/stores/globalStore';
import metricCatStudy from '@/static/pic/catr0.png';
import UShouldKnowDetail from './UShouldKnowDetail';
import s from './quick.module.less';

const DEFAULT_LAYOUT = Object.freeze({
    topHeight: 32,
    bottomLeftWidth: 40,
    bottomRightTopHeight: 52,
});

const LAYOUT_LIMITS = Object.freeze({
    minTopHeight: 20,
    maxTopHeight: 48,
    minAboutHeight: 25,
    maxAboutHeight: 70,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const highlightWords = (text, words, className, variantClassName = '') => {
    const source = String(text || '');
    const normalizedWords = Array.from(new Set((words || []).map((item) => String(item || '').trim()).filter(Boolean)));
    if (!normalizedWords.length) {
        return source;
    }
    const pattern = new RegExp(`(${normalizedWords.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length).join('|')})`, 'gi');
    const normalizedSet = new Set(normalizedWords.map((item) => item.toLowerCase()));
    const parts = source.split(pattern).filter((part) => part !== '');
    let matchIndex = 0;

    return parts.map((part, idx) => {
        if (!normalizedSet.has(part.toLowerCase())) {
            return <span key={`plain-${idx}`}>{part}</span>;
        }
        const inkDelay = `${Math.min(matchIndex * 90, 720)}ms`;
        matchIndex += 1;
        return <span
            key={`highlight-${idx}-${part}`}
            className={`${className} ${variantClassName}`.trim()}
            style={{'--ink-delay': inkDelay}}
        >{part}</span>;
    });
};

const buildBackgroundSkills = (skills, highlightSkills, cols, rows) => {
    const normalizedSkills = Array.isArray(skills) && skills.length ? skills : ['Skill'];
    const highlightSet = new Set((highlightSkills || []).map((item) => String(item || '').trim()));
    const nodes = [];
    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            const index = (row * cols) + col;
            const name = normalizedSkills[index % normalizedSkills.length];
            const jitterX = (((index % 5) - 2) * 0.12);
            const jitterY = ((((index + 3) % 7) - 3) * 0.12);
            const x = clamp((((col + 0.5) / cols) * 100) + jitterX, 1.4, 98.6);
            const y = clamp((((row + 0.5) / rows) * 100) + jitterY, 1.2, 98.8);
            nodes.push({
                key: `${name}-${index}`,
                name,
                x,
                y,
                idx: index,
                accent: highlightSet.has(name),
            });
        }
    }
    return nodes;
};

const CONTENT = Object.freeze({
    zh: {
        heroTitle: ['Hi, I am R0', 'True Fullstack Delivery.'],
        positioning: '不是普通“前后端拼接型”全栈，而是同时覆盖美术/视觉设计、前后端客户端工程与算法建模，真正的全栈交付，拥有超强的闭环能力。',
        skillsTitle: 'Skills',
        skills: [
            'C++', 'Modern C++', 'STL', 'RAII', 'Golang', 'Python3', 'TypeScript', 'JavaScript',
            'React', 'Next.js', 'Vue3', 'Electron', 'Node.js', 'gRPC', 'WebSocket', 'FastAPI', 'Django', 'Gin', 'Go-Zero',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'ClickHouse', 'Elasticsearch', 'Kafka', 'RabbitMQ',
            'Docker', 'Kubernetes', 'Terraform', 'Nginx', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'OpenTelemetry',
            'Scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'PyTorch', 'TensorFlow', 'Learning to Rank', 'CTR/CVR Modeling',
            'Sequence Modeling', 'Graph Embedding', 'A/B Testing', 'Causal Inference', 'Bayesian Optimization', 'DQN', 'PPO',
            'RAG', 'LangChain', 'LangGraph', 'LlamaIndex', 'FAISS', 'HNSW', 'ANN Retrieval', 'Milvus', 'Weaviate', 'Pinecone',
            'OpenAI API', 'Claude API', 'Function Calling', 'Agent Workflow', 'Prompt Caching', 'LoRA', 'PEFT', 'RLHF', 'vLLM', 'ONNX Runtime',
        ],
        skillHighlights: ['C++', 'Golang', 'Python3', 'React', 'Node.js', 'gRPC', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'RAG', 'LangGraph', 'FAISS', 'vLLM'],
        workTitle: 'Work',
        workCate: 'Art + Client + Backend + Algorithm',
        workName: 'FULLSTACK SYSTEM BUILDER',
        projectLabel: 'From Idea to Production',
        projectStack: ['Design', 'Client', 'Backend', 'Algorithm'],
        workHighlights: [
            'Visual language + interaction system design',
            'Frontend / backend / client runtime implementation',
            'Recommendation + LLM agent strategy integration',
            'Deployment, observability, and iterative closed-loop operation',
        ],
        workProofs: [
            {label: 'System Scope', value: 'Design → Client → Backend → Algorithm'},
            {label: 'Execution Mode', value: 'Independent end-to-end ownership'},
            {label: 'Delivery Quality', value: 'Production-grade + measurable loop'},
        ],
        aboutTitle: 'About Me',
        aboutText: '我偏好把复杂问题拆成可落地模块，再用可观测、可回滚的方式快速上线。核心优势是把“视觉表现、工程架构、算法策略”做成一体化系统。',
        experienceTitle: 'Company Experience',
        experiences: [
            {company: 'OpenVision', summary: '算法负责人 · 全球站推荐 / 数据治理 / 营收优化'},
            {company: 'Tencent IEG', summary: '后端研发 & AIGC 专项领头 · 推荐/审查/激励平台 + AIGC 落地'},
            {company: 'DeepRoute.ai / MSRA', summary: '算法工程 · 视觉决策链路与工程化实现'},
        ],
        contactTitle: 'Contact Me',
        contact: 'ushouldknowr0@gmail.com',
    },
    en: {
        heroTitle: ['Hi, I am R0', 'True Fullstack Delivery.'],
        positioning: 'Not a regular fullstack profile. I integrate visual/art direction, frontend-backend-client engineering, and algorithm modeling into one production pipeline. This is real fullstack delivery with exceptional closed-loop capability.',
        positioningHighlights: [
            'visual/art direction',
            'frontend-backend-client engineering',
            'algorithm modeling',
            'real fullstack delivery',
            'closed-loop capability',
        ],
        skillsTitle: 'Skills',
        skills: [
            'C++', 'Modern C++', 'STL', 'RAII', 'Golang', 'Python3', 'TypeScript', 'JavaScript', 'React', 'Next.js',
            'Vue3', 'Electron', 'Node.js', 'gRPC', 'WebSocket', 'FastAPI', 'Django', 'Gin', 'Go-Zero', 'MySQL',
            'PostgreSQL', 'MongoDB', 'Redis', 'ClickHouse', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'Docker', 'Kubernetes', 'Terraform',
            'Nginx', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'OpenTelemetry', 'Scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost',
            'PyTorch', 'TensorFlow', 'Learning to Rank', 'CTR/CVR Modeling', 'Sequence Modeling', 'Graph Embedding', 'A/B Testing', 'Causal Inference', 'Bayesian Optimization', 'DQN',
            'PPO', 'MDP', 'RAG', 'LangChain', 'LangGraph', 'LlamaIndex', 'FAISS', 'HNSW', 'ANN Retrieval', 'Milvus',
            'Weaviate', 'Pinecone', 'OpenAI API', 'Claude API', 'Function Calling', 'Agent Workflow', 'Prompt Caching', 'LoRA', 'PEFT', 'RLHF',
            'vLLM', 'ONNX Runtime', 'LLaMA', 'Mistral', 'Qwen', 'DeepSeek', 'OpenLLM', 'ComfyUI', 'Stable Diffusion', 'ControlNet',
            'AnimateDiff', 'NumPy', 'Pandas', 'Spark', 'Flink', 'Airflow', 'dbt', 'Data Governance', 'Tag Governance', 'Data Quality',
            'Data Lineage', 'Feature Engineering', 'Embedding Retrieval', 'Multi-Armed Bandit', 'Uplift Modeling', 'Pairwise Ranking', 'Listwise Ranking', 'LambdaMART', 'GCN', 'GraphSAGE',
            'Word2Vec', 'BERT Embedding', 'Cold Start Strategy', 'UCB/Thompson Sampling', 'Recall@K', 'NDCG', 'Dynamic Programming', 'Graph Algorithms', 'A* Search', 'Event Pipeline',
            'Tornado', 'MobX', 'Tailwind CSS', 'RESTful API', 'Microservices', 'CQRS', 'Event Sourcing', 'JWT',
        ],
        skillHighlights: ['C++', 'Golang', 'Python3', 'React', 'Node.js', 'gRPC', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'RAG', 'LangGraph', 'FAISS', 'vLLM'],
        workTitle: 'Work',
        workCate: 'Art + Client + Backend + Algorithm',
        workName: 'FULLSTACK SYSTEM BUILDER',
        projectLabel: 'From Idea to Production',
        projectStack: ['Design', 'Client', 'Backend', 'Algorithm'],
        workHighlights: [
            'Visual language + interaction system design',
            'Frontend / backend / client runtime implementation',
            'Recommendation + LLM agent strategy integration',
            'Deployment, observability, and iterative closed-loop operation',
        ],
        workProofs: [
            {label: 'System Scope', value: 'Design → Client → Backend → Algorithm'},
            {label: 'Execution Mode', value: 'Independent end-to-end ownership'},
            {label: 'Delivery Quality', value: 'Production-grade + measurable loop'},
        ],
        aboutTitle: 'About Me',
        aboutText: 'I have worked across startups, large tech companies, and research institutes. With complete fullstack closed-loop capability, I can independently survive and sustain value in the real world.',
        aboutHighlights: [
            'startups',
            'large tech companies',
            'research institutes',
            'complete fullstack closed-loop capability',
            'independently survive and sustain value in the real world',
        ],
        experienceTitle: 'Company Experience',
        experiences: [
            {
                company: 'OpenVision',
                period: '2025.08 - Present',
                progress: 96,
                face: '(•̀ᴗ•́)و',
                summary: 'Algorithm Lead · global recommendation, data governance, and revenue optimization loop.',
                highlights: ['Algorithm Lead', 'global recommendation', 'revenue optimization loop'],
                focus: ['Fantasy studio algorithm roadmap', 'Revenue-quality loop', 'Data governance at scale'],
            },
            {
                company: 'Tencent IEG',
                period: '2022.07 - 2025.08',
                progress: 88,
                face: '(=^･ω･^=)',
                summary: 'Backend Engineer & AIGC Initiative Lead · recommendation/review/incentive platform and AIGC delivery.',
                highlights: ['AIGC Initiative Lead', 'recommendation/review/incentive platform', 'AIGC delivery'],
                focus: ['Recommendation + review infra', 'KOL incentive platform', 'LLM/RAG production delivery'],
            },
            {
                company: 'DeepRoute.ai',
                period: '2021.06 - 2021.12',
                progress: 76,
                face: '(๑˃̵ᴗ˂̵)',
                summary: 'Software Engineer · autonomous-driving behavior and trajectory planning pipeline.',
                highlights: ['autonomous-driving behavior', 'trajectory planning pipeline'],
                focus: ['Behavior planning', 'Trajectory optimization', 'Cloud + vehicle pipeline'],
            },
            {
                company: 'MSRA',
                period: '2021.12 - 2022.06',
                progress: 82,
                face: '(✧ω✧)',
                summary: 'Algorithm Researcher · RL decision agent and policy simulation system.',
                highlights: ['Algorithm Researcher', 'RL decision agent', 'policy simulation system'],
                focus: ['RL decision agent', 'Policy simulation', 'Causal + explainable modeling'],
            },
        ],
        contactTitle: 'Contact Me',
        contact: 'ushouldknowr0@gmail.com',
    },
    ja: {
        heroTitle: ['Hi, I am R0', 'True Fullstack Delivery.'],
        positioning: '通常のフルスタックではなく、ビジュアル/アート設計、フロント/バック/クライアント実装、アルゴリズム設計を一体で本番化し、強力なクローズドループ実行力を持ちます。',
        skillsTitle: 'Skills',
        skills: [
            'C++', 'Modern C++', 'STL', 'RAII', 'Golang', 'Python3', 'TypeScript', 'JavaScript',
            'React', 'Next.js', 'Vue3', 'Electron', 'Node.js', 'gRPC', 'WebSocket', 'FastAPI', 'Django', 'Gin', 'Go-Zero',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'ClickHouse', 'Elasticsearch', 'Kafka', 'RabbitMQ',
            'Docker', 'Kubernetes', 'Terraform', 'Nginx', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'OpenTelemetry',
            'Scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'PyTorch', 'TensorFlow', 'Learning to Rank', 'CTR/CVR Modeling',
            'Sequence Modeling', 'Graph Embedding', 'A/B Testing', 'Causal Inference', 'Bayesian Optimization', 'DQN', 'PPO',
            'RAG', 'LangChain', 'LangGraph', 'LlamaIndex', 'FAISS', 'HNSW', 'ANN Retrieval', 'Milvus', 'Weaviate', 'Pinecone',
            'OpenAI API', 'Claude API', 'Function Calling', 'Agent Workflow', 'Prompt Caching', 'LoRA', 'PEFT', 'RLHF', 'vLLM', 'ONNX Runtime',
        ],
        skillHighlights: ['C++', 'Golang', 'Python3', 'React', 'Node.js', 'gRPC', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'RAG', 'LangGraph', 'FAISS', 'vLLM'],
        workTitle: 'Work',
        workCate: 'Art + Client + Backend + Algorithm',
        workName: 'FULLSTACK SYSTEM BUILDER',
        projectLabel: 'From Idea to Production',
        projectStack: ['Design', 'Client', 'Backend', 'Algorithm'],
        workHighlights: [
            'Visual language + interaction system design',
            'Frontend / backend / client runtime implementation',
            'Recommendation + LLM agent strategy integration',
            'Deployment, observability, and iterative closed-loop operation',
        ],
        workProofs: [
            {label: 'System Scope', value: 'Design → Client → Backend → Algorithm'},
            {label: 'Execution Mode', value: 'Independent end-to-end ownership'},
            {label: 'Delivery Quality', value: 'Production-grade + measurable loop'},
        ],
        aboutTitle: 'About Me',
        aboutText: '複雑な課題を実装可能な単位に分解し、可観測性とロールバック性を担保しながら素早く本番投入します。ビジュアル品質・実装力・アルゴ戦略を一体で設計できるのが強みです。',
        experienceTitle: 'Company Experience',
        experiences: [
            {company: 'OpenVision', summary: 'Algorithm Lead · グローバル推薦 / データガバナンス / 収益最適化'},
            {company: 'Tencent IEG', summary: 'Backend Engineer & AIGC Initiative Lead · 推薦/審査/インセンティブ基盤 + AIGC 実装'},
            {company: 'DeepRoute.ai / MSRA', summary: 'Algorithm Engineer · 視覚意思決定パイプラインの実装と運用'},
        ],
        contactTitle: 'Contact Me',
        contact: 'ushouldknowr0@gmail.com',
    },
});

function UShouldKnowQuick() {
    const {lang} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const containerRef = useRef(null);
    const [layout, setLayout] = useState(DEFAULT_LAYOUT);
    const [dragging, setDragging] = useState(null);
    const [isIntroReady, setIsIntroReady] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(typeof window === 'undefined' ? 1440 : window.innerWidth);
    const [mousePoint, setMousePoint] = useState({x: 50, y: 50, active: false});

    const safeLang = useMemo(() => {
        if (lang === 'en' || lang === 'ja' || lang === 'zh') {
            return lang;
        }
        return 'zh';
    }, [lang]);

    const copy = CONTENT.en;
    const isDetailMode = location.pathname.endsWith('/detail') || new URLSearchParams(location.search).get('view') === 'detail';
    const backgroundSkills = useMemo(() => {
        const compact = viewportWidth <= 840;
        const cols = compact ? 10 : viewportWidth <= 1280 ? 16 : 20;
        const rows = compact ? 22 : 15;
        return buildBackgroundSkills(copy.skills, copy.skillHighlights, cols, rows);
    }, [copy.skills, copy.skillHighlights, viewportWidth]);

    const toDetail = () => {
        navigate(`/ushouldknow/${safeLang}/detail`);
    };

    const startDrag = (type) => (event) => {
        event.preventDefault();
        setDragging(type);
    };

    const handleCanvasMouseMove = (event) => {
        if (!containerRef.current) {
            return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        if (!rect.width || !rect.height) {
            return;
        }
        const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
        const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
        setMousePoint({x, y, active: true});
    };

    const handleCanvasMouseLeave = () => {
        setMousePoint((prev) => ({...prev, active: false}));
    };

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const raf = window.requestAnimationFrame(() => {
            setIsIntroReady(true);
        });
        return () => {
            window.cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        if (!dragging || !containerRef.current) {
            return undefined;
        }

        const handleMouseMove = (event) => {
            if (!containerRef.current) {
                return;
            }
            const rect = containerRef.current.getBoundingClientRect();

            setLayout((prev) => {
                const next = {...prev};

                if (dragging === 'horizontal-main') {
                    const nextTopHeight = ((event.clientY - rect.top) / rect.height) * 100;
                    next.topHeight = clamp(nextTopHeight, LAYOUT_LIMITS.minTopHeight, LAYOUT_LIMITS.maxTopHeight);
                } else if (dragging === 'vertical-bottom') {
                    const nextBottomLeftWidth = ((event.clientX - rect.left) / rect.width) * 100;
                    next.bottomLeftWidth = clamp(nextBottomLeftWidth, 30, 70);
                } else if (dragging === 'horizontal-bottom-right') {
                    const topOffset = (prev.topHeight / 100) * rect.height;
                    const bottomHeight = rect.height - topOffset;
                    const mouseOffset = event.clientY - rect.top - topOffset;
                    const nextAboutHeight = (mouseOffset / bottomHeight) * 100;
                    next.bottomRightTopHeight = clamp(nextAboutHeight, LAYOUT_LIMITS.minAboutHeight, LAYOUT_LIMITS.maxAboutHeight);
                }

                return next;
            });
        };

        const handleMouseUp = () => {
            setDragging(null);
        };

        const cursorType = dragging.includes('horizontal') ? 'row-resize' : 'col-resize';
        document.body.style.cursor = cursorType;
        document.body.style.userSelect = 'none';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    if (isDetailMode) {
        return <UShouldKnowDetail initialView='detail' lockView/>;
    }

    return <ReactDocumentTitle title={`${globalStore.webSiteTitle} - UShouldKnow Quick`}>
        <main className={s.page}>
            <section className={`${s.canvas} ${isIntroReady ? s.canvasIntroReady : ''}`}>
                <div ref={containerRef} className={s.canvasBody} onMouseMove={handleCanvasMouseMove} onMouseLeave={handleCanvasMouseLeave}>
                    <div className={s.skillsBackground} aria-hidden>
                        {backgroundSkills.map((item) => {
                            const radius = viewportWidth <= 840 ? 18 : 10;
                            const distance = Math.hypot(item.x - mousePoint.x, item.y - mousePoint.y);
                            const glow = mousePoint.active ? clamp(1 - (distance / radius), 0, 1) : 0;
                            return <span
                                key={item.key}
                                className={`${s.bgSkill} ${item.accent ? s.bgSkillAccent : ''} ${glow > 0 ? s.bgSkillActive : ''}`}
                                style={{left: `${item.x}%`, top: `${item.y}%`, '--glow': glow.toFixed(3), '--seed': `${item.idx % 4}`}}
                            >{item.name}</span>;
                        })}
                    </div>

                    <div className={s.topSection} style={{height: `${layout.topHeight}%`}}>
                        <article className={`${s.panel} ${s.heroPanel}`} style={{width: '100%'}}>
                            <h1 className={s.heroHeading}>
                                <span>{copy.heroTitle[0]}</span>
                                <span>{copy.heroTitle[1]}</span>
                            </h1>
                            <p className={s.heroSubline}>{highlightWords(copy.positioning, copy.positioningHighlights, s.highlightInk, s.highlightInkWarm)}</p>
                        </article>
                    </div>

                    <button
                        type='button'
                        className={`${s.dividerHorizontal} ${s.dividerMain} ${dragging === 'horizontal-main' ? s.dividerActive : ''}`}
                        style={{top: `${layout.topHeight}%`}}
                        onMouseDown={startDrag('horizontal-main')}
                        aria-label='Resize top and bottom panels'
                    >
                        <span className={s.dividerLineHorizontal}/>
                    </button>

                    <div className={s.bottomSection} style={{height: `${100 - layout.topHeight}%`}}>
                        <article className={`${s.panel} ${s.workPanel}`} style={{width: `${layout.bottomLeftWidth}%`}}>
                            <h2 className={s.sectionTitle}>{copy.workTitle}</h2>
                            <p className={s.metaText}>{copy.workCate}</p>
                            <div className={s.workCenter}>{copy.workName}</div>
                            <ul className={s.workHighlights}>
                                {copy.workHighlights.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                            <div className={s.workProofs}>
                                {copy.workProofs.map((item) => <div key={item.label}>
                                    <strong>{item.label}</strong>
                                    <span>{item.value}</span>
                                </div>)}
                            </div>
                            <div className={s.workFoot}>
                                <span>{copy.projectLabel}</span>
                                <span>{copy.projectStack.join('   ')}</span>
                            </div>
                        </article>

                        <button
                            type='button'
                            className={`${s.dividerVertical} ${dragging === 'vertical-bottom' ? s.dividerActive : ''}`}
                            onMouseDown={startDrag('vertical-bottom')}
                            aria-label='Resize bottom panels'
                        >
                            <span className={s.dividerLineVertical}/>
                        </button>

                        <div className={s.bottomRightSection} style={{width: `${100 - layout.bottomLeftWidth}%`}}>
                            <article className={`${s.panel} ${s.aboutPanel}`} style={{height: `${layout.bottomRightTopHeight}%`}}>
                                <h2 className={s.sectionTitle}>{copy.aboutTitle}</h2>
                                <div className={s.aboutBody}>
                                    <button type='button' className={s.aboutAvatarBtn} onClick={toDetail} aria-label='Open detail page'>
                                        <img src={metricCatStudy} alt='avatar' className={s.aboutAvatar}/>
                                    </button>
                                    <p>{highlightWords(copy.aboutText, copy.aboutHighlights, s.highlightInk, s.highlightInkCool)}</p>
                                </div>
                            </article>

                            <button
                                type='button'
                                className={`${s.dividerHorizontal} ${s.dividerSub} ${dragging === 'horizontal-bottom-right' ? s.dividerActive : ''}`}
                                style={{top: `${layout.bottomRightTopHeight}%`}}
                                onMouseDown={startDrag('horizontal-bottom-right')}
                                aria-label='Resize about and contact panels'
                            >
                                <span className={s.dividerLineHorizontal}/>
                            </button>

                            <article
                                className={`${s.panel} ${s.experiencePanel}`}
                                style={{
                                    top: `${layout.bottomRightTopHeight}%`,
                                    height: `calc((100% - ${layout.bottomRightTopHeight}%) * 0.74)`,
                                }}
                            >
                                <h3 className={s.experienceTitle}>{copy.experienceTitle}</h3>
                                <div className={s.experienceRail}>
                                    <div className={s.experienceGlobalTrack} aria-hidden>
                                        <span/>
                                    </div>
                                    <div className={s.experienceList}>
                                        {copy.experiences.map((item, idx) => <article key={item.company} className={s.experienceItem}>
                                            <div className={s.experienceHead}>
                                                <strong>{item.company}</strong>
                                                <span>{item.period}</span>
                                            </div>
                                            <div className={s.experienceTrack} aria-hidden>
                                                <span style={{width: `${item.progress}%`}}/>
                                                <i className={s.experienceFace} style={{left: `${item.progress}%`, animationDelay: `${idx * 120}ms`}}>{item.face}</i>
                                            </div>
                                            <p>{highlightWords(item.summary, item.highlights, s.highlightInk, s.highlightInkCool)}</p>
                                            {Array.isArray(item.focus) && item.focus.length ? <div className={s.experienceFocus}>
                                                {item.focus.map((focus) => <span key={`${item.company}-${focus}`}>{focus}</span>)}
                                            </div> : null}
                                        </article>)}
                                    </div>
                                </div>
                            </article>

                            <article
                                className={`${s.panel} ${s.contactPanel}`}
                                style={{
                                    top: `calc(${layout.bottomRightTopHeight}% + (100% - ${layout.bottomRightTopHeight}%) * 0.74)`,
                                    height: `calc((100% - ${layout.bottomRightTopHeight}%) * 0.26)`,
                                }}
                            >
                                <h2 className={`${s.sectionTitle} ${s.contactTitle}`}>{copy.contactTitle}</h2>
                                <a href={`mailto:${copy.contact}`} className={s.contactLink}>{copy.contact}</a>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </ReactDocumentTitle>;
}

export default UShouldKnowQuick;
