import {Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Cursor from '@/components/cursor/cursor';
import {ShowR0} from '@/components/r0/showR0';
import metricCatBook from '@/static/pic/book.png';
import metricCatCoffee from '@/static/pic/coffee_cat.png';
import metricCatStudy from '@/static/pic/catr0.png';
import signLineImg from '@/static/pic/sign_line.png';
import s from './index.module.less';

const metricCardBgPool = Object.freeze([metricCatBook, metricCatCoffee, metricCatStudy, metricCatStudy]);
function pickRandomMetricBg() {
    return metricCardBgPool[Math.floor(Math.random() * metricCardBgPool.length)];
}

const stackWordCloud = [
    {name: 'Golang', icon: 'https://cdn.simpleicons.org/go/00ADD8', tier: 1, tracks: ['fullstack', 'algoData']},
    {name: 'Python3', icon: 'https://cdn.simpleicons.org/python/3776AB', tier: 1, tracks: ['llm', 'algoData', 'reco']},
    {name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6', tier: 1, tracks: ['fullstack']},
    {name: 'C++', icon: 'https://cdn.simpleicons.org/cplusplus/00599C', tier: 1, tracks: ['reco', 'algoData', 'fullstack']},
    {name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E', tier: 1, tracks: ['fullstack']},
    {name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB', tier: 1, tracks: ['fullstack']},
    {name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933', tier: 1, tracks: ['fullstack', 'algoData']},
    {name: 'gRPC', icon: '', emoji: '🔗', tier: 1, tracks: ['fullstack']},
    {name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1', tier: 1, tracks: ['fullstack', 'algoData']},
    {name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/DC382D', tier: 1, tracks: ['fullstack', 'reco']},
    {name: 'Kafka', icon: 'https://cdn.simpleicons.org/apachekafka/231F20', tier: 1, tracks: ['fullstack', 'algoData']},
    {name: 'RabbitMQ', icon: 'https://cdn.simpleicons.org/rabbitmq/FF6600', tier: 1, tracks: ['fullstack', 'algoData']},
    {name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED', tier: 2, tracks: ['fullstack', 'algoData']},
    {name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes/326CE5', tier: 2, tracks: ['fullstack', 'algoData']},
    {name: 'Gin', icon: '', emoji: '⚙️', tier: 2, tracks: ['fullstack']},
    {name: 'Go-Zero', icon: '', emoji: '🧭', tier: 2, tracks: ['fullstack']},
    {name: 'FastAPI', icon: 'https://cdn.simpleicons.org/fastapi/009688', tier: 2, tracks: ['fullstack', 'llm']},
    {name: 'Django', icon: 'https://cdn.simpleicons.org/django/092E20', tier: 2, tracks: ['fullstack', 'algoData']},
    {name: 'Vue3', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D', tier: 2, tracks: ['fullstack']},
    {name: 'Electron', icon: 'https://cdn.simpleicons.org/electron/47848F', tier: 2, tracks: ['fullstack']},
    {name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', tier: 2, tracks: ['algoData', 'fullstack']},
    {name: 'Elasticsearch', icon: 'https://cdn.simpleicons.org/elasticsearch/005571', tier: 2, tracks: ['algoData', 'reco']},
    {name: 'Memcached', icon: '', emoji: '📦', tier: 2, tracks: ['fullstack']},
    {name: 'WebSocket', icon: 'https://cdn.simpleicons.org/socketdotio/010101', tier: 2, tracks: ['fullstack']},
    {name: 'Consul', icon: 'https://cdn.simpleicons.org/consul/F24C53', tier: 3, tracks: ['fullstack']},
    {name: 'Nacos', icon: '', emoji: '🛰️', tier: 3, tracks: ['fullstack']},
    {name: 'Scikit-learn', icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E', tier: 2, tracks: ['reco', 'algoData']},
    {name: 'XGBoost', icon: '', emoji: '🌲', tier: 3, tracks: ['reco', 'algoData']},
    {name: 'LightGBM', icon: '', emoji: '💡', tier: 3, tracks: ['reco', 'algoData']},
    {name: 'CatBoost', icon: '', emoji: '🐱', tier: 4, tracks: ['reco', 'algoData']},
    {name: 'Learning to Rank', icon: '', emoji: '📊', tier: 3, tracks: ['reco']},
    {name: 'Wide & Deep', icon: '', emoji: '🏗️', tier: 4, tracks: ['reco']},
    {name: 'FM/DeepFM', icon: '', emoji: '🧷', tier: 4, tracks: ['reco']},
    {name: 'CTR/CVR Modeling', icon: '', emoji: '🎚️', tier: 3, tracks: ['reco']},
    {name: 'Sequence Modeling', icon: '', emoji: '🌀', tier: 3, tracks: ['reco']},
    {name: 'Graph Embedding', icon: '', emoji: '🕸️', tier: 4, tracks: ['reco', 'algoData']},
    {name: 'Multi-Armed Bandit', icon: '', emoji: '🎰', tier: 4, tracks: ['reco']},
    {name: 'Uplift Modeling', icon: '', emoji: '📈', tier: 4, tracks: ['reco']},
    {name: 'K-Means', icon: '', emoji: '🧠', tier: 3, tracks: ['reco', 'algoData']},
    {name: 'GMM', icon: '', emoji: '📈', tier: 3, tracks: ['reco', 'algoData']},
    {name: 'Feature Engineering', icon: '', emoji: '🧩', tier: 3, tracks: ['reco', 'algoData']},
    {name: 'Embedding Retrieval', icon: '', emoji: '🧲', tier: 3, tracks: ['reco', 'llm']},
    {name: 'PyTorch', icon: 'https://cdn.simpleicons.org/pytorch/EE4C2C', tier: 3, tracks: ['llm', 'reco', 'algoData']},
    {name: 'TensorFlow', icon: 'https://cdn.simpleicons.org/tensorflow/FF6F00', tier: 3, tracks: ['llm', 'reco', 'algoData']},
    {name: 'Reinforcement Learning', icon: '', emoji: '🎯', tier: 2, tracks: ['algoData']},
    {name: 'DQN', icon: '', emoji: '🔁', tier: 3, tracks: ['algoData']},
    {name: 'PPO', icon: '', emoji: '♻️', tier: 3, tracks: ['algoData']},
    {name: 'MDP', icon: '', emoji: '🧮', tier: 3, tracks: ['algoData']},
    {name: 'Causal Inference', icon: '', emoji: '🔬', tier: 3, tracks: ['algoData']},
    {name: 'Bayesian Optimization', icon: '', emoji: '📐', tier: 4, tracks: ['reco', 'algoData']},
    {name: 'Dynamic Programming', icon: '', emoji: '🧾', tier: 3, tracks: ['algoData']},
    {name: 'Graph Algorithms', icon: '', emoji: '🕸️', tier: 3, tracks: ['algoData']},
    {name: 'Greedy Algorithms', icon: '', emoji: '⚡', tier: 4, tracks: ['algoData']},
    {name: 'A* Search', icon: '', emoji: '🛣️', tier: 3, tracks: ['algoData']},
    {name: 'ACM/ICPC', icon: '', emoji: '🏁', tier: 2, tracks: ['algoData']},
    {name: 'Data Governance', icon: '', emoji: '🧱', tier: 2, tracks: ['algoData']},
    {name: 'Tag Governance', icon: '', emoji: '🏷️', tier: 3, tracks: ['algoData']},
    {name: 'Data Quality', icon: '', emoji: '✅', tier: 3, tracks: ['algoData']},
    {name: 'Data Lineage', icon: '', emoji: '🧬', tier: 4, tracks: ['algoData']},
    {name: 'LLaMA', icon: 'https://cdn.simpleicons.org/meta/0467DF', tier: 3, tracks: ['llm']},
    {name: 'Mistral', icon: 'https://cdn.simpleicons.org/mistral/FF7000', tier: 3, tracks: ['llm']},
    {name: 'Stable Diffusion', icon: '', emoji: '🧪', tier: 3, tracks: ['llm']},
    {name: 'ControlNet', icon: '', emoji: '🎛️', tier: 3, tracks: ['llm']},
    {name: 'AnimateDiff', icon: '', emoji: '🎞️', tier: 3, tracks: ['llm']},
    {name: 'RAG', icon: '', emoji: '📚', tier: 3, tracks: ['llm', 'algoData', 'reco']},
    {name: 'LangChain', icon: 'https://cdn.simpleicons.org/langchain/1C3C3C', tier: 3, tracks: ['llm']},
    {name: 'LlamaIndex', icon: '', emoji: '🗂️', tier: 3, tracks: ['llm', 'algoData']},
    {name: 'vLLM', icon: '', emoji: '🚀', tier: 4, tracks: ['llm']},
    {name: 'OpenLLM', icon: '', emoji: '🧩', tier: 4, tracks: ['llm']},
    {name: 'MCP-Agent', icon: '', emoji: '🤖', tier: 4, tracks: ['llm', 'algoData']},
    {name: 'ComfyUI', icon: '', emoji: '🎨', tier: 4, tracks: ['llm']},
    {name: 'Pairwise Ranking', icon: '', emoji: '↔️', tier: 4, tracks: ['reco']},
    {name: 'Listwise Ranking', icon: '', emoji: '📋', tier: 4, tracks: ['reco']},
    {name: 'LambdaMART', icon: '', emoji: '🪜', tier: 4, tracks: ['reco']},
    {name: 'A/B Testing', icon: '', emoji: '🧪', tier: 3, tracks: ['reco', 'algoData']},
    {name: 'Recall@K', icon: '', emoji: '🎯', tier: 4, tracks: ['reco']},
    {name: 'NDCG', icon: '', emoji: '📐', tier: 4, tracks: ['reco']},
    {name: 'UCB/Thompson Sampling', icon: '', emoji: '🎲', tier: 4, tracks: ['reco']},
    {name: 'Cold Start Strategy', icon: '', emoji: '🧊', tier: 4, tracks: ['reco']},
    {name: 'FAISS', icon: '', emoji: '🗃️', tier: 3, tracks: ['reco', 'llm']},
    {name: 'HNSW', icon: '', emoji: '🕸️', tier: 4, tracks: ['reco']},
    {name: 'ANN Retrieval', icon: '', emoji: '🧭', tier: 3, tracks: ['reco', 'llm']},
    {name: 'GCN', icon: '', emoji: '🧠', tier: 4, tracks: ['reco', 'algoData']},
    {name: 'GraphSAGE', icon: '', emoji: '🛰️', tier: 4, tracks: ['reco', 'algoData']},
    {name: 'Word2Vec', icon: '', emoji: '🧵', tier: 4, tracks: ['reco', 'llm']},
    {name: 'BERT Embedding', icon: '', emoji: '📘', tier: 4, tracks: ['reco', 'llm']},
    {name: 'Qwen', icon: '', emoji: '🀄', tier: 4, tracks: ['llm']},
    {name: 'DeepSeek', icon: '', emoji: '🔍', tier: 4, tracks: ['llm']},
    {name: 'OpenAI API', icon: 'https://cdn.simpleicons.org/openai/412991', tier: 3, tracks: ['llm']},
    {name: 'Claude API', icon: '', emoji: '🧾', tier: 4, tracks: ['llm']},
    {name: 'LangGraph', icon: '', emoji: '🕹️', tier: 4, tracks: ['llm']},
    {name: 'Function Calling', icon: '', emoji: '📞', tier: 3, tracks: ['llm']},
    {name: 'Agent Workflow', icon: '', emoji: '🧩', tier: 3, tracks: ['llm']},
    {name: 'Prompt Caching', icon: '', emoji: '💾', tier: 4, tracks: ['llm']},
    {name: 'LoRA', icon: '', emoji: '🪶', tier: 3, tracks: ['llm']},
    {name: 'PEFT', icon: '', emoji: '🔧', tier: 4, tracks: ['llm']},
    {name: 'SFT', icon: '', emoji: '🧑‍🏫', tier: 4, tracks: ['llm']},
    {name: 'RLHF', icon: '', emoji: '🤝', tier: 4, tracks: ['llm']},
    {name: 'Quantization', icon: '', emoji: '📉', tier: 3, tracks: ['llm']},
    {name: 'ONNX Runtime', icon: 'https://cdn.simpleicons.org/onnx/005CED', tier: 4, tracks: ['llm']},
    {name: 'Triton Inference Server', icon: '', emoji: '🚦', tier: 4, tracks: ['llm']},
    {name: 'Milvus', icon: '', emoji: '📦', tier: 4, tracks: ['llm', 'algoData']},
    {name: 'Weaviate', icon: '', emoji: '🧿', tier: 4, tracks: ['llm']},
    {name: 'Pinecone', icon: '', emoji: '🌲', tier: 4, tracks: ['llm']},
    {name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/FFFFFF', tier: 2, tracks: ['fullstack']},
    {name: 'Vite', icon: 'https://cdn.simpleicons.org/vite/646CFF', tier: 3, tracks: ['fullstack']},
    {name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', tier: 3, tracks: ['fullstack']},
    {name: 'MobX', icon: '', emoji: '🧊', tier: 3, tracks: ['fullstack']},
    {name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1', tier: 2, tracks: ['fullstack', 'algoData']},
    {name: 'ClickHouse', icon: 'https://cdn.simpleicons.org/clickhouse/FFCC01', tier: 3, tracks: ['fullstack', 'algoData']},
    {name: 'Nginx', icon: 'https://cdn.simpleicons.org/nginx/009639', tier: 3, tracks: ['fullstack']},
    {name: 'Prometheus', icon: 'https://cdn.simpleicons.org/prometheus/E6522C', tier: 3, tracks: ['fullstack', 'algoData']},
    {name: 'Grafana', icon: 'https://cdn.simpleicons.org/grafana/F46800', tier: 3, tracks: ['fullstack', 'algoData']},
    {name: 'OpenTelemetry', icon: 'https://cdn.simpleicons.org/opentelemetry/000000', tier: 4, tracks: ['fullstack']},
    {name: 'Terraform', icon: 'https://cdn.simpleicons.org/terraform/7B42BC', tier: 3, tracks: ['fullstack']},
    {name: 'GitHub Actions', icon: 'https://cdn.simpleicons.org/githubactions/2088FF', tier: 3, tracks: ['fullstack']},
    {name: 'CI/CD', icon: '', emoji: '🔁', tier: 3, tracks: ['fullstack']},
    {name: 'RESTful API', icon: '', emoji: '🌐', tier: 3, tracks: ['fullstack']},
    {name: 'Microservices', icon: '', emoji: '🧱', tier: 3, tracks: ['fullstack']},
    {name: 'CQRS', icon: '', emoji: '📚', tier: 4, tracks: ['fullstack']},
    {name: 'Event Sourcing', icon: '', emoji: '🧾', tier: 4, tracks: ['fullstack']},
    {name: 'JWT', icon: '', emoji: '🔐', tier: 4, tracks: ['fullstack']},
    {name: 'Topological Sort', icon: '', emoji: '🧮', tier: 4, tracks: ['algoData']},
    {name: 'Union-Find', icon: '', emoji: '🪢', tier: 4, tracks: ['algoData']},
    {name: 'Segment Tree', icon: '', emoji: '🌲', tier: 4, tracks: ['algoData']},
    {name: 'Bitset Ops', icon: '', emoji: '🧱', tier: 4, tracks: ['algoData']},
    {name: 'NumPy', icon: 'https://cdn.simpleicons.org/numpy/013243', tier: 2, tracks: ['algoData']},
    {name: 'Pandas', icon: 'https://cdn.simpleicons.org/pandas/150458', tier: 2, tracks: ['algoData']},
    {name: 'Spark', icon: 'https://cdn.simpleicons.org/apachespark/E25A1C', tier: 3, tracks: ['algoData']},
    {name: 'Flink', icon: 'https://cdn.simpleicons.org/apacheflink/E6526F', tier: 3, tracks: ['algoData']},
    {name: 'Airflow', icon: 'https://cdn.simpleicons.org/apacheairflow/017CEE', tier: 3, tracks: ['algoData']},
    {name: 'dbt', icon: 'https://cdn.simpleicons.org/dbt/FF694B', tier: 3, tracks: ['algoData']},
    {name: 'Superset', icon: 'https://cdn.simpleicons.org/apachesuperset/20A6C9', tier: 4, tracks: ['algoData']},
    {name: 'Feature Store', icon: '', emoji: '🏪', tier: 3, tracks: ['algoData']},
    {name: 'MLflow', icon: '', emoji: '🧪', tier: 4, tracks: ['algoData']},
    {name: 'Great Expectations', icon: '', emoji: '✅', tier: 4, tracks: ['algoData']},
    {name: 'DataHub', icon: '', emoji: '🧭', tier: 4, tracks: ['algoData']},
    {name: 'Delta Lake', icon: '', emoji: '🏞️', tier: 4, tracks: ['algoData']},
    {name: 'Tornado', icon: '', emoji: '🌪️', tier: 3, tracks: ['fullstack']},
    {name: 'OpenCV', icon: 'https://cdn.simpleicons.org/opencv/5C3EE8', tier: 2, tracks: ['algoData', 'fullstack']},
    {name: 'Ultralytics', icon: '', emoji: '🦾', tier: 3, tracks: ['algoData', 'fullstack']},
    {name: 'BoxMOT', icon: '', emoji: '🧭', tier: 3, tracks: ['algoData']},
    {name: 'OCSORT', icon: '', emoji: '🧷', tier: 3, tracks: ['algoData']},
    {name: 'Multi-view Homography', icon: '', emoji: '📐', tier: 3, tracks: ['algoData']},
    {name: 'Rule-based Detection', icon: '', emoji: '🚨', tier: 3, tracks: ['algoData']},
    {name: 'Event Pipeline', icon: '', emoji: '📨', tier: 3, tracks: ['fullstack', 'algoData']},
    {name: 'Linformer', icon: '', emoji: '📏', tier: 3, tracks: ['llm']},
    {name: 'Linear Attention', icon: '', emoji: '⚡', tier: 3, tracks: ['llm']},
    {name: 'Solidity', icon: 'https://cdn.simpleicons.org/solidity/363636', tier: 4, tracks: ['fullstack']},
];

const KAOMOJI_SYMBOLS_BASE = Object.freeze([
    '(｡･ω･｡)', '(•̀ᴗ•́)و', '(๑•̀ㅂ•́)و✧', '(๑˃̵ᴗ˂̵)و', '(ง •̀_•́)ง', '(｀･ω･´)', '(ง ͠° ͟ʖ ͡°)ง', '(๑•̀ㅁ•́๑)✧',
    '(=^･ω･^=)', '(ฅ^•ﻌ•^ฅ)', '(=｀ω´=)', '(=^･ｪ･^=))ﾉ彡☆', '(=①ω①=)', '(^・ω・^ )', '(=^‥^=)', '(=ＴェＴ=)',
    '(>ω<)', '(≧▽≦)', '(≧ω≦)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(✧ω✧)', '(☆▽☆)', '٩(｡•́‿•̀｡)۶', 'ヽ(✿ﾟ▽ﾟ)ノ',
    '(๑˘︶˘๑)', '(´,,•ω•,,)♡', '(｡♥‿♥｡)', '(づ｡◕‿‿◕｡)づ', '(っ˘ω˘ς)', '(づ￣ ³￣)づ', '(ﾉ´ з `)ノ', '( ˘ ³˘)♥',
    '(*￣▽￣)b', 'ヽ(・∀・)ﾉ', '＼(^o^)／', '(⌐■_■)', '(๑•̀д•́๑)', '(¬‿¬)', '(￣ー￣)', '(￣▽￣)ノ',
    '(・ω・)ノ', '(・∀・)', '(＾▽＾)', '^_^', 'OwO', 'UwU', '(>_<)', '(T_T)', '(；￣Д￣)', '(；´Д｀)', '(╯°□°）╯︵ ┻━┻',
    '¯\\_(ツ)_/¯', '(¬_¬")', '(；¬д¬)', '(⊙_⊙)', '(￣□￣;)', '(；一_一)', '(>﹏<)', '(ಥ﹏ಥ)',
    'ヘ(￣ω￣ヘ)', '(～￣▽￣)～', '♪(´▽｀)', '(❁´◡`❁)', '(｡◕‿◕｡)', '(づ￣ 3￣)づ', '(*^▽^*)', '(o゜▽゜)o☆',
    '⸜(｡˃ ᵕ ˂ )⸝', '(ง •_•)ง', '(￣^￣)ゞ', '(｀・ω・´)ゞ', '(⚆_⚆)', '(・_・;)', '( •̀ ω •́ )✧', '(๑• . •๑)',
    '</>', '{ }', '=>', '&&', '::', 'λ', '[[]]', '<*>', '░▒▓█', '0101', 'rEAdEmER0',
]);
const KAOMOJI_SYMBOLS_EXTRA = Object.freeze([
    "ʕง•ᴥ•ʔง", "ʕ•ᴥ•ʔ", "ʕ ᵔᴥᵔ ʔ", "ʕ•̀ ω • ʔ", "ʕ•̀ o • ʔ", "(•̀ᴗ• ) ̑̑", "ฅʕ•̫͡•ʔฅ", "(ง ˙o˙)ว",
    "´͈ ᵕ `͈", "ฅ⁽͑ ˚̀ ˙̭ ˚ ⁾̉ฅ", "⋆ᶿ̵᷄ ˒̼ᶿ̵᷅⋆", "ヽ( ຶ▮ ຶ)ﾉ!!!", "´• •`", "•﹏•", "˃̣̣̥᷄⌓˂̣̣̥᷅", "( ⁼̴̀ .̫ ⁼̴ )✧",
    "(•̀⌓• )シ", "(๑･▱･๑)", "(•̶̑ ૄ •̶̑)", "˘̩̩̩ε˘̩ƪ", "| ᐕ)⁾⁾", "୧⍢⃝୨", "( ᐛ )", "ꉂ೭(˵¯̴͒ꇴ¯̴͒˵) ”",
    "ꉂ(ˊᗜˋ*)", "(⁎⁍̴̛ᴗ⁍̴̛⁎)", "ʕ•̫͡• ʔ•̫͡•ཻʕ•̫͡•ʔ•͓͡•ʔ", "ᕙ(•̤᷆ ॒ ູ॒•̤᷇)ᕘ", "(*´◒`*)", "(˃̶͈̀௰˂̶͈ )",
    "( ง⁼̴̀ω⁼̴ )ง⁼³₌₃", "(๑⁼̴̀д⁼̴ ๑)", "(•ૢ⚈͒⌄⚈͒•ૢ)", "₍₍ (̨̡ ‾᷄ᗣ‾᷅ )̧̢ ₎₎", "✧ʕ̢̣̣̣̣̩̩̩̩·͡˔· Ɂ̡̣̣̣̣̩̩̩̩✧", "( *・ω・)✄╰ひ╯",
    "(·•᷄ࡇ•᷅ ）", "(◍•ᴗ•◍)", "(՞• •՞)", "ˁ˙͡˟˙ˀ", "⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽", "꒰ꌶ ̯ ̜ꌶ ꒱", "ʕ•ﻌ•ʔ", "ि०॰०ॢी",
    "(৹ᵒ̴̶̷᷄́ฅᵒ̴̶̷᷅৹)", "ꉂꉂ꒰•̤▿•̤*ૢ꒱", "( Ꙭ)", "o(´^｀)o", "~(˶‾᷄ꈊ‾᷅˵)~", "̋(๑˃́ꇴ˂̀๑)", "๐•ᴗ•๐", "( ᵒ̴̶̷̤ꈊ˂̶̤̀ )✧",
    "( ˚ཫ˚ )", "(;´༎ຶД༎ຶ`)", "/ᐠ｡ꞈ｡ᐟ\\", ",,Ծ‸Ծ,,", "..........ᴅᴜᴅᴜ！", "つ♡⊂", "ᑋᵉᑊᑊᵒ ᵕ̈ ᑋᵉᑊᑊᵒ", "( ˶º̬˶ )୨⚑\"",
    "ᕱ⑅ᕱ", "₍ᐢ •͈ ༝ •͈ ᐢ₎♡", "(⑉꒦ິ^꒦ິ⑉)", "( ´•̥×•̥` )", "ʕ̯•͡ˑ͓•̯᷅ʔ", "´༥`", "ฅ ˘ฅ", "(๑ᵒ̴̶̷͈᷄ᗨᵒ̴̶̷͈᷅)",
    "ฅ՞•ﻌ•՞ฅ", "°꒰๑'ꀾ'๑꒱°", "(՞•Ꙫ•՞)", "ʕु•̫͡•ʔु ✧", "ᶘ ᵒᴥᵒᶅ", "◔.̮◔✧", "(ᕑᗢᓫ∗)˒", "(*ꈍ꒙ꈍ*)",
    "ꐦ≖ ≖", "ഒ", "ॱଳॱ", "･◡･", "꒦ິ^꒦ິ", "•́‸ก", "ᵕ᷄≀ ̠˘᷅", "˙³˙", "˃̶͈ ˂̶͈", "๑҉",
    "⚆_⚆", "•ɷ•", "દ ᵕ̈ ૩", "⚗︎·̫⚗︎", "̑̑ᗦ↞◃", "૮ ・ﻌ・ა", "⎛ -᷄ ᴥ -᷅ ⎞೯", "˗ˋˏ ♡ ˎˊ˗",
    "(๑´0`๑)", "( •︠ˍ•︡ )", "(ˊo̴̶̷̤ ̫ o̴̶̷̤ˋ)", "|•'-'•) ✧", "ฅ •ﻌ•♡", "*⸜( •ᴗ• )⸝*", "(⸝⸝•‧̫•⸝⸝)", "( ૢ⁼̴̤̆ ꇴ ⁼̴̤̆ ૢ)~ෆ",
    "(˶˚ ᗨ ˚˶)", "(｡•ᴗ-)_", "( ´◔ ‸◔`)", "( '༥' )", "(ˊᵒ̴̶̷̤ꇴᵒ̴̶̷̤ˋ)", "(◕ˇ∀ˇ◕。)", "（ ་Ꙫ ་）", "(•‿•)",
    "(,,•́.•̀,,)", "(•͈˽•͈)", "୧(﹒︠ᴗ﹒︡)୨", "ȏ.̮ȏ", "(〃'▽'〃)", "ㅇㅅㅇ", "Ծ‸Ծ", "´•ᴥ•`", "･ᴥ･",
    "₍ᐢ.ˬ.⑅ᐢ₎", "꒰´•͈⌔•͈⑅꒱", "=͟͟͞͞ʕ•̫͡•ʔ=͟͟͞͞ʕ•̫͡•ʔ", "๑°°๑", "(°⌓°)", "₍ᐢ..ᐢ₎", "•̀ᴗ• •̀ᴗ•́", "·ꙫ·",
    "˙Ꙫ˙", "๐˙Ⱉ˙๐", "˙Ⱉ˙", "ง⍢⃝ว", "(๑ ꒪ꌂ꒪๑)", "ʕ̢·͡˔·ོɁ̡̣", "ฅ ฅ", "ʚ ɞ",
     "ง ง", "߹ ߹", "•᷄ɞ•᷅", "(´ސު｀)", "( ˶ ❛ ꁞ ❛ ˶ )", "ᓫ(°⌑°)ǃ", "୧º̣͙•̥͙º̣͙୨",
    "⛈", "⸝⸝· ᴥ ·⸝⸝", "ʕ·͡ˑ·ཻʔ", "ʕ•̫͡•ོʔ", "°꒰'ꀾ'꒱°", "˙ϖ˙", "^•ﻌ•^", ".˗ˏˋ♡ˎˊ˗", "・ࡇ・",
    "คค ฅ ฅ", "εïз ઇଓ ʚ ɞ", "ʕ•̫͡•ʕ*̫͡*ʔ", "ʕ•͓͡•ʔ-̫͡-ʔ", "ʕ•̫͡•ʔ*̫͡*ʔ-̫͡-ʔ", "(´･ᆺ･`)", "g˙Ꙫ˙d", "✧⁺⸜(˙▾˙)⸝⁺✧",
    "(◠ܫ◠)", "(҂`･ｪ･´)", "ʕ•̀ o •́ʔ", "꒰✩˙˟˙✩꒱", "(●´∞`●)", "(◍˃̶ᗜ˂̶◍)✩",
    "•͈౿•͈", "(๑･ิ◡･ิ๑)", "(•”̮•)", "(●'▿'●)", "( ੭ ˙ᗜ˙ )੭", "ʕʘ̅͜ʘ̅ʔ", "ᵔ︡⌔ᵔ︠", "‘٩꒰｡•◡•｡꒱۶’",
    "( •᷄⌓•᷅ )", "(๑•̌.•̑๑)ˀ̣ˀ̣", "( ¯⌓¯ )", "(๑´ڡ`๑)", "( *´ސު｀*)", "(ꈍᴗꈍ)", "⸜(*ˊᗜˋ*)⸝", "ʕ⸝⸝ᴥ˶กʔ꜆꜄꜆꜄꜆",
    "(ღˇ◡ˇ)♥ℒᵒᵛᵉᵧₒᵤ♥", "˶⍤⃝˶꒳ᵒ꒳ᵎᵎᵎ", "O̤̮K̤̮‬", "ꔚ", "τнänκ чöü♥", "੯‧̀͡u\\", "૮◍⁰ᯅ⁰◍ა", "ᖰ ˙ỏ˙ ᖳ",
    "ᖰ ᵕ༚ᵕ ᖳ", "( ˶ˊᵕˋ)੭♡", "ꉂꉂ(ˊᗜˋ*)ʬʬ", "（˶･֊･˶）（՞˶･֊･˶՞）", "(͒ ⓿ᴥ⓿ )͒", "༼ಢ_ಢ༽", "ᡣ ︠ . . ︡",
    "₍ᐢ.ˬ.ᐢ₎❤️", "๑'ڡ'๑", "๑˃̶͈̀Ⱉ˂̶͈́๑", "ʕっ˘ڡ˘ςʔ", "ก็็็็็็็็็็็็็ʕ•͡ᴥ•ʔ ก้้้้้้้้้้้", "⎛⎝(•‿•)⎠⎞",
    "ᐢ ᐢ", "ᐡ ᐡ", "ᵔ ᵔ", "՞ ՞", "ᙏ", "∩∩", "⍝ ⍝", "ᕱ ᕱ", "ᕬ ᕬ", "ᘏᘏ", "ᥥ ᥥ", "⸝ဗီူ⸜","QaQ","QAQ","ouo","o.O???","QwQ"

]);
const KAOMOJI_SYMBOLS = Object.freeze(Array.from(new Set([...KAOMOJI_SYMBOLS_BASE, ...KAOMOJI_SYMBOLS_EXTRA])));
const SYMBOL_PARTICLE_COUNT_DESKTOP = 84;
const SYMBOL_PARTICLE_COUNT_MOBILE = 52;
const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));
const pickRandomSymbol = () => KAOMOJI_SYMBOLS[Math.floor(Math.random() * KAOMOJI_SYMBOLS.length)];
function buildSymbolParticles(count) {
    return Array.from({length: count}).map((_, idx) => {
        const phase = idx / Math.max(1, count);
        const homeX = Number((2 + (Math.random() * 96)).toFixed(3));
        const homeY = Number((2 + (Math.random() * 96)).toFixed(3));
        return {
            key: `p-${idx}`,
            text: pickRandomSymbol(),
            x: homeX,
            y: homeY,
            homeX,
            homeY,
            delay: `${-(idx % 11) * 0.58}s`,
            duration: `${7.5 + ((idx * 0.47) % 5.5)}s`,
            scale: Number((0.62 + ((Math.sin(phase * Math.PI * 2) + 1) * 0.15) + (Math.random() * 0.26)).toFixed(3)),
            opacity: Number((0.17 + Math.random() * 0.19).toFixed(3)),
        };
    });
}
const getSymbolParticleCount = () => (typeof window !== 'undefined' && window.innerWidth <= 720 ? SYMBOL_PARTICLE_COUNT_MOBILE : SYMBOL_PARTICLE_COUNT_DESKTOP);
const AGE_TOKEN = '__LIVE_AGE__';
const BIRTHDAY_TS = Date.parse('2000-08-20T00:00:00+08:00');
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;

const HERO_ASCII_HANYUAN_STANDARD = String.raw`  _   _    _    _   ___   ___   _   _    _   _   _     ___ _   _  ____
 | | | |  / \  | \ | \ \ / / | | | / \  | \ | | | |   |_ _| \ | |/ ___|
 | |_| | / _ \ |  \| |\ V /| | | |/ _ \ |  \| | | |    | ||  \| | |  _
 |  _  |/ ___ \| |\  | | | | |_| / ___ \| |\  | | |___ | || |\  | |_| |
 |_| |_/_/   \_\_| \_| |_|  \___/_/   \_\_| \_| |_____|___|_| \_|\____|`;

const HERO_ASCII_READEMER0_STANDARD = String.raw` _____  _____    _    ____  _____ __  __ _____ ____   ___
|  __ \| ____|  / \  |  _ \| ____|  \/  | ____|  _ \ / _ \
| |__) |  _|   / _ \ | | | |  _| | |\/| |  _| | |_) | | | |
|  _  /| |___ / ___ \| |_| | |___| |  | | |___|  _ <| |_| |
|_| \_\|_____/_/   \_\____/|_____|_|  |_|_____|_| \_\\___/`;

const HERO_ASCII_USHOULKDKNOW_STANDARD = String.raw` _   _ ____  _   _  ___  _   _ _     _  ______  _  ___   _  _____        __
| | | / ___|| | | |/ _ \| | | | |   | |/ /  _ \| |/ / \ | |/ _ \ \      / /
| | | \___ \| |_| | | | | | | | |   | ' /| | | | ' /|  \| | | | \ \ /\ / /
| |_| |___) |  _  | |_| | |_| | |___| . \| |_| | . \| |\  | |_| |\ V  V /
 \___/|____/|_| |_|\___/ \___/|_____|_|\_\____/|_|\_\_| \_|\___/  \_/\_/`;

const MORPH_CHARS = ['.', ':', '-', '=', '+', '*', '#', '%', '&', '@', '/', '\\', '|', '<', '>'];
const trackAccentMap = Object.freeze({
    reco: '#00cec9',
    llm: '#fd79a8',
    fullstack: '#74b9ff',
    algoData: '#ffeaa7',
});

const trackStackTermMap = Object.freeze({
    reco: ['Python3', 'C++', 'Scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'PyTorch', 'TensorFlow', 'Learning to Rank', 'Pairwise Ranking', 'Listwise Ranking', 'LambdaMART', 'Wide & Deep', 'FM/DeepFM', 'CTR/CVR Modeling', 'Sequence Modeling', 'Feature Engineering', 'Embedding Retrieval', 'Graph Embedding', 'GCN', 'GraphSAGE', 'Word2Vec', 'BERT Embedding', 'K-Means', 'GMM', 'FAISS', 'HNSW', 'ANN Retrieval', 'Multi-Armed Bandit', 'UCB/Thompson Sampling', 'Uplift Modeling', 'A/B Testing', 'Recall@K', 'NDCG', 'Cold Start Strategy', 'Redis', 'Elasticsearch', 'RAG'],
    llm: ['Python3', 'FastAPI', 'PyTorch', 'TensorFlow', 'LLaMA', 'Mistral', 'Qwen', 'DeepSeek', 'OpenAI API', 'Claude API', 'RAG', 'LangChain', 'LangGraph', 'LlamaIndex', 'MCP-Agent', 'Function Calling', 'Agent Workflow', 'Prompt Caching', 'Linformer', 'Linear Attention', 'LoRA', 'PEFT', 'SFT', 'RLHF', 'Quantization', 'ONNX Runtime', 'vLLM', 'Triton Inference Server', 'OpenLLM', 'Milvus', 'Weaviate', 'Pinecone', 'ComfyUI', 'Stable Diffusion', 'ControlNet', 'AnimateDiff'],
    fullstack: ['C++', 'Modern C++ (C++17/20)', 'STL', 'RAII', 'Golang', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'Vite', 'Tailwind CSS', 'MobX', 'Node.js', 'gRPC', 'RESTful API', 'WebSocket', 'Tornado', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'ClickHouse', 'Kafka', 'RabbitMQ', 'Nginx', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'OpenTelemetry', 'OpenCV', 'Ultralytics', 'Event Pipeline', 'Gin', 'Go-Zero', 'FastAPI', 'Django', 'Vue3', 'Electron', 'Consul', 'Nacos', 'Microservices', 'CQRS', 'Event Sourcing', 'JWT', 'Solidity'],
    algoData: ['ACM/ICPC', 'Dynamic Programming', 'Graph Algorithms', 'Topological Sort', 'Union-Find', 'Segment Tree', 'Greedy Algorithms', 'A* Search', 'Bitset Ops', 'Reinforcement Learning', 'DQN', 'PPO', 'MDP', 'Causal Inference', 'Bayesian Optimization', 'Scikit-learn', 'XGBoost', 'LightGBM', 'PyTorch', 'TensorFlow', 'NumPy', 'Pandas', 'OpenCV', 'Ultralytics', 'Multi-view Homography', 'BoxMOT', 'OCSORT', 'Rule-based Detection', 'Event Pipeline', 'Spark', 'Flink', 'Airflow', 'dbt', 'Superset', 'Feature Store', 'MLflow', 'Great Expectations', 'Data Governance', 'Tag Governance', 'Data Quality', 'Data Lineage', 'DataHub', 'RAG', 'LlamaIndex', 'MCP-Agent', 'Delta Lake', 'Prometheus', 'Grafana'],
});

const trackStackGroupMap = Object.freeze({
    reco: {
        basis: ['Python3', 'C++'],
        ranking: ['Learning to Rank', 'Pairwise Ranking', 'Listwise Ranking', 'LambdaMART', 'Wide & Deep', 'FM/DeepFM', 'CTR/CVR Modeling', 'Sequence Modeling', 'Multi-Armed Bandit', 'UCB/Thompson Sampling', 'Uplift Modeling', 'A/B Testing', 'Recall@K', 'NDCG', 'Cold Start Strategy'],
        retrieval: ['K-Means', 'GMM', 'Feature Engineering', 'Embedding Retrieval', 'Graph Embedding', 'GCN', 'GraphSAGE', 'Word2Vec', 'BERT Embedding', 'FAISS', 'HNSW', 'ANN Retrieval'],
        ml: ['Scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'PyTorch', 'TensorFlow'],
        serving: ['Redis', 'Elasticsearch', 'RAG'],
    },
    llm: {
        basis: ['Python3', 'FastAPI', 'PyTorch', 'TensorFlow'],
        models: ['LLaMA', 'Mistral', 'Qwen', 'DeepSeek', 'OpenAI API', 'Claude API', 'OpenLLM', 'Linformer'],
        orchestration: ['RAG', 'LangChain', 'LangGraph', 'LlamaIndex', 'MCP-Agent', 'Function Calling', 'Agent Workflow', 'Prompt Caching'],
        adaptation: ['LoRA', 'PEFT', 'SFT', 'RLHF', 'Quantization', 'ONNX Runtime', 'vLLM', 'Triton Inference Server', 'Linear Attention'],
        multimodal: ['Milvus', 'Weaviate', 'Pinecone', 'Stable Diffusion', 'ControlNet', 'AnimateDiff', 'ComfyUI'],
    },
    fullstack: {
        language: ['C++', 'Modern C++ (C++17/20)', 'STL', 'RAII', 'Golang', 'TypeScript', 'JavaScript'],
        frontend: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'MobX', 'Vue3', 'Electron'],
        backend: ['Node.js', 'gRPC', 'RESTful API', 'WebSocket', 'Tornado', 'Gin', 'Go-Zero', 'FastAPI', 'Django', 'JWT'],
        storage: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'ClickHouse'],
        infra: ['Kafka', 'RabbitMQ', 'Nginx', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'OpenTelemetry', 'Consul', 'Nacos'],
        architecture: ['Microservices', 'CQRS', 'Event Sourcing', 'Event Pipeline', 'OpenCV', 'Ultralytics', 'Solidity'],
    },
    algoData: {
        acm: ['ACM/ICPC', 'Dynamic Programming', 'Graph Algorithms', 'Topological Sort', 'Union-Find', 'Segment Tree', 'Greedy Algorithms', 'A* Search', 'Bitset Ops'],
        intelligent: ['Reinforcement Learning', 'DQN', 'PPO', 'MDP', 'Causal Inference', 'Bayesian Optimization', 'Scikit-learn', 'XGBoost', 'LightGBM', 'PyTorch', 'TensorFlow', 'Feature Engineering', 'OpenCV', 'Ultralytics', 'Multi-view Homography', 'BoxMOT', 'OCSORT'],
        dataEngineering: ['NumPy', 'Pandas', 'Spark', 'Flink', 'Airflow', 'dbt', 'Superset', 'Feature Store', 'MLflow', 'Great Expectations', 'Delta Lake'],
        governance: ['Data Governance', 'Tag Governance', 'Data Quality', 'Data Lineage', 'DataHub'],
        tooling: ['RAG', 'LlamaIndex', 'MCP-Agent', 'Rule-based Detection', 'Event Pipeline', 'Prometheus', 'Grafana'],
    },
});

const trackExtraDetailMap = Object.freeze({
    en: {
        reco: ['Jointly optimizes retention, conversion, and risk under explicit constraints.'],
        llm: ['Includes Linformer linear multi-head attention reproduction for efficiency-focused LLM internals.'],
        fullstack: ['Real-time service architecture capability: streaming transport, async orchestration, and event-driven reliability control.'],
        algoData: ['Computer-vision decision capability: geometric alignment, tracking lifecycle modeling, and rule-driven risk judgment.'],
    },
    zh: {
        reco: ['在显式约束下同时优化留存、转化与风险敞口。'],
        llm: ['具备 Linformer 线性多头注意力复现经验，从编排能力延伸到注意力复杂度优化实现。'],
        fullstack: ['具备实时服务架构能力：流式传输、异步编排与事件驱动的可靠性控制。'],
        algoData: ['具备视觉决策能力：几何对齐、多目标跟踪生命周期建模与规则驱动风险判定。'],
    },
    ja: {
        reco: ['制約条件下で継続率・転換率・リスク露出を同時最適化。'],
        llm: ['Linformer線形Multi-head Attention再現を追加し、編成だけでなく注意機構の効率実装まで拡張。'],
        fullstack: ['実時間サービス設計能力：ストリーミング伝送、非同期編成、イベント駆動の信頼性制御。'],
        algoData: ['視覚意思決定能力：幾何整列、追跡ライフサイクル設計、ルール駆動のリスク判定。'],
    },
});

const ContactIcon = ({type}) => {
    if (type === 'phone') {
        return <svg viewBox='0 0 1024 1024' aria-hidden focusable='false'>
            <path d='M788.48 0h-552.96c-42.496 0-76.8 34.304-76.8 76.8v71.168c0 14.336 11.264 25.6 25.6 25.6h629.76v593.92h-604.16v-467.456c0-14.336-11.264-25.6-25.6-25.6s-25.6 11.264-25.6 25.6v647.168c0 42.496 34.304 76.8 76.8 76.8h552.96c42.496 0 76.8-34.304 76.8-76.8v-870.4c0-42.496-34.304-76.8-76.8-76.8z m-578.56 122.368v-45.568c0-14.336 11.264-25.6 25.6-25.6h552.96c14.336 0 25.6 11.264 25.6 25.6v45.568h-604.16z m578.56 850.432h-552.96c-14.336 0-25.6-11.264-25.6-25.6v-128.512h604.16v128.512c0 13.824-11.264 25.6-25.6 25.6z' fill='currentColor'/>
            <path d='M512 896m-52.224 0a52.224 52.224 0 1 0 104.448 0 52.224 52.224 0 1 0-104.448 0Z' fill='currentColor'/>
        </svg>;
    }
    if (type === 'email') {
        return <svg viewBox='0 0 1024 1024' aria-hidden focusable='false'>
            <path d='M938.666667 85.333333a42.666667 42.666667 0 0 1 42.666666 42.666667v597.333333a42.666667 42.666667 0 0 1-42.666666 42.666667l-284.8 0.042667c-22.954667 35.562667-49.386667 65.28-79.36 89.024-53.376 42.346667-118.997333 69.376-196.330667 81.237333a32 32 0 0 1-36.693333-28.736L341.333333 906.666667l-0.021333-138.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V128a42.666667 42.666667 0 0 1 42.666666-42.666667h853.333334z m-21.333334 64H106.666667v554.666667h298.666666v163.84c47.146667-11.328 87.786667-29.802667 122.154667-55.338667l7.253333-5.568c31.808-25.237333 59.370667-59.456 82.56-102.912H618.666667V704h298.666666V149.333333zM394.666667 384a32 32 0 0 1 0 64h-128a32 32 0 0 1 0-64h128z m362.666666 0a32 32 0 0 1 0 64h-128a32 32 0 0 1 0-64h128z' fill='currentColor'/>
        </svg>;
    }
    if (type === 'wechat') {
        return <svg viewBox='0 0 1025 1024' aria-hidden focusable='false'>
            <path d='M1016.32 570.88c-30.72-110.08-112.64-179.2-240.64-207.36-28.16-5.12-40.96-12.8-46.08-38.4-2.56-20.48-15.36-38.4-25.6-53.76-69.12-110.08-179.2-168.96-320-176.64l0 0c-102.4 2.56-179.2 23.04-243.2 69.12-110.08 79.36-153.6 179.2-133.12 299.52 12.8 66.56 48.64 122.88 115.2 176.64 12.8 10.24 15.36 17.92 10.24 30.72-7.68 20.48-15.36 40.96-20.48 66.56-2.56 7.68 0 20.48 5.12 28.16 5.12 5.12 20.48 0 25.6 0C153.6 755.2 166.4 750.08 181.76 742.4c15.36-7.68 33.28-17.92 51.2-25.6 7.68-2.56 20.48-5.12 30.72-5.12 53.76 2.56 97.28 5.12 138.24 10.24 5.12 0 12.8 7.68 17.92 12.8 56.32 112.64 186.88 179.2 314.88 161.28 66.56-10.24 110.08 0 153.6 28.16 5.12 5.12 12.8 5.12 20.48 5.12 2.56 0 7.68 0 10.24 0l5.12 0 0-5.12c0-2.56 0-5.12 0-7.68 0-7.68 2.56-15.36 0-20.48-20.48-40.96-12.8-69.12 25.6-102.4C1013.76 732.16 1039.36 652.8 1016.32 570.88zM166.4 691.2c2.56-10.24 5.12-20.48 10.24-30.72 10.24-20.48 5.12-35.84-15.36-51.2-58.88-43.52-92.16-89.6-104.96-148.48-23.04-102.4 12.8-189.44 104.96-256 58.88-43.52 133.12-64 204.8-64 104.96 0 212.48 43.52 276.48 125.44 12.8 17.92 23.04 38.4 35.84 61.44 5.12 7.68 7.68 17.92 12.8 28.16-107.52 7.68-194.56 51.2-248.32 122.88-43.52 56.32-58.88 128-43.52 199.68-7.68 0-15.36 0-25.6 0-23.04 0-43.52 0-61.44-5.12C261.12 660.48 222.72 665.6 186.88 691.2c-5.12 2.56-10.24 5.12-17.92 7.68-2.56 0-2.56 2.56-5.12 2.56C163.84 698.88 166.4 693.76 166.4 691.2zM931.84 734.72c-17.92 23.04-35.84 40.96-51.2 53.76-23.04 17.92-28.16 35.84-17.92 61.44 2.56 2.56 2.56 7.68 2.56 10.24 0 2.56 0 2.56 0 5.12l0 0c-20.48-20.48-43.52-25.6-64-25.6-15.36 0-28.16 2.56-43.52 5.12-7.68 0-15.36 2.56-20.48 2.56-102.4 12.8-189.44-23.04-250.88-99.84-64-79.36-56.32-192 23.04-266.24 53.76-51.2 133.12-79.36 212.48-76.8 79.36 5.12 153.6 38.4 204.8 97.28C983.04 570.88 988.16 663.04 931.84 734.72z' fill='currentColor'/>
            <path d='M248.32 304.64m-43.52 0a1.7 1.7 0 1 0 87.04 0 1.7 1.7 0 1 0-87.04 0Z' fill='currentColor'/>
            <path d='M499.2 304.64m-43.52 0a1.7 1.7 0 1 0 87.04 0 1.7 1.7 0 1 0-87.04 0Z' fill='currentColor'/>
            <path d='M611.84 550.4m-33.28 0a1.3 1.3 0 1 0 66.56 0 1.3 1.3 0 1 0-66.56 0Z' fill='currentColor'/>
            <path d='M808.96 550.4m-33.28 0a1.3 1.3 0 1 0 66.56 0 1.3 1.3 0 1 0-66.56 0Z' fill='currentColor'/>
        </svg>;
    }
    if (type === 'instagram') {
        return <svg viewBox='0 0 24 24' aria-hidden focusable='false'>
            <path d='M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5zm8.5 1.8a3.95 3.95 0 0 1 3.95 3.95v8.5a3.95 3.95 0 0 1-3.95 3.95h-8.5a3.95 3.95 0 0 1-3.95-3.95v-8.5A3.95 3.95 0 0 1 7.75 3.8h8.5zM17.4 5.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 1.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4z' fill='currentColor'/>
        </svg>;
    }
    if (type === 'github') {
        return <svg viewBox='0 0 1024 1024' aria-hidden focusable='false'>
            <path d='M512 64C264.58 64 64 264.58 64 512c0 197.86 128.24 365.8 306.04 425.02 22.38 4.12 30.56-9.72 30.56-21.58 0-10.66-0.4-45.9-0.62-83.2-124.5 27.06-150.8-52.9-150.8-52.9-20.36-51.76-49.72-65.52-49.72-65.52-40.66-27.8 3.06-27.24 3.06-27.24 44.98 3.16 68.66 46.2 68.66 46.2 39.98 68.5 104.84 48.7 130.38 37.24 4.02-28.96 15.64-48.72 28.44-59.92-99.4-11.3-203.96-49.7-203.96-221.24 0-48.88 17.48-88.86 46.14-120.2-4.66-11.28-20-56.78 4.36-118.38 0 0 37.62-12.04 123.24 45.92 35.76-9.92 74.1-14.9 112.2-15.08 38.1 0.18 76.44 5.16 112.24 15.08 85.56-57.96 123.14-45.92 123.14-45.92 24.42 61.6 9.08 107.1 4.44 118.38 28.72 31.34 46.08 71.32 46.08 120.2 0 171.96-104.76 209.82-204.44 220.88 16.08 13.92 30.4 41.22 30.4 83.08 0 60-0.54 108.34-0.54 123.08 0 11.96 8.06 25.92 30.78 21.52C831.96 877.68 960 709.8 960 512c0-247.42-200.58-448-448-448z' fill='currentColor'/>
        </svg>;
    }
    return <svg viewBox='0 0 1024 1024' aria-hidden focusable='false'>
        <path d='M648.6 160.6c-2.4-0.4-4.8-0.6-7.2-0.6v0.8-0.6h-0.8c-44 0-85.8 51.8-95.6 120.6-10.6 73.2 18.8 138 65.4 144.8 2.6 0.4 5.4 0.6 8 0.6 44 0 85.8-51.8 95.6-120.6 10.6-73.4-18.8-138.2-65.4-145z m34 140.2c-8 55.8-39.8 93.2-64.2 93.2-1.2 0-2.4 0-3.4-0.2-11.4-1.6-22.2-12.2-29.8-29-9.8-21.6-13-50.4-8.8-79.4 8-55.4 39.6-92.6 64-93.2 1.2 0 3.2 0.2 4 0.2 11.4 1.6 22 12.2 29.6 29 9.8 21.4 12.8 50.4 8.6 79.4zM641.2 160zM884.6 338.8c-7-2.8-14.2-4.2-21.8-4.2h-0.8c-39.4 0.6-83.6 38.4-106.8 95.6-27.8 68.4-15 138.4 28.8 156.4 7 2.8 14.2 4.2 21.8 4.2 39.6 0 84.4-38 107.8-95.6 27.6-68.4 14.6-138.4-29-156.4z m-0.8 144.2c-9.4 23-23.2 43.4-39.2 57.4-13.4 11.6-27.6 18.4-39 18.4-3.6 0-6.8-0.6-9.8-1.8-10.6-4.4-18.6-17.2-22-35.4-4.2-23.2-0.4-52.2 10.6-79.2 9.4-23 23.4-43.4 39.2-57.4 13.2-11.6 27-18.2 38.4-18.4 3.8 0 7 0.6 10 1.8 10.6 4.4 18.8 17.2 22.2 35.4 4.4 23.4 0.6 52.2-10.4 79.2zM655.2 590.8c-55.6-87.2-79.6-120-143.2-120s-87.8 33-143.4 120c-47.6 74.4-143.8 80.6-167.8 143.8-4.8 11.2-7.2 23.4-7.2 36.4 0 51.4 41.6 93 92.8 93 63.6 0 150.2-48 225.8-48s161.8 48 225.4 48c51.2 0 92.6-41.6 92.6-93 0-13-2.6-25.2-7.4-36.4-24-63.4-120-69.4-167.6-143.8zM737.6 832c-25.6 0-58.8-10.2-94-21-43-13.2-87.4-27-131.6-27-44.2 0-88.6 13.6-131.6 26.8-35.2 10.8-68.4 21-94 21-33.6 0-61-27.4-61-61 0-8.6 1.6-16.6 4.6-23.8l0.2-0.6 0.2-0.6c8-21.2 32-34.8 62.2-52 35.2-20 75-42.6 102.8-86 55.4-86.8 71.6-105.4 116.6-105.4 23.6 0 38 5.2 53.2 19 18 16.6 37.6 46.2 63.2 86.4 27.8 43.4 67.4 66 102.6 86 30.2 17.2 54 30.8 62.2 52l0.2 0.6 0.2 0.6c3.2 7.6 4.8 15.6 4.8 23.8 0 33.8-27.2 61.2-60.8 61.2zM405.6 426c2.6 0 5.4-0.2 8-0.6 46.8-6.8 76-71.6 65.4-144.8-10-69-51.8-120.6-95.6-120.6-2.6 0-5.4 0.2-8 0.6-46.8 6.8-76 71.6-65.4 144.8 10 68.8 51.8 120.6 95.6 120.6z m-55.4-204.8c7.6-16.8 18.4-27.4 29.8-29 1.2-0.2 2.2-0.2 3.4-0.2 24.6 0 56.2 37.4 64.2 93.2 4.2 29 1 58-8.8 79.4-7.6 16.8-18.4 27.4-29.8 29-1.2 0.2-2.2 0.2-3.4 0.2-24.6 0-56.2-37.4-64.2-93.2-4.2-28.8-1-57.8 8.8-79.4zM240.2 586.6c43.8-18 56.6-88 28.8-156.4-23.4-57.6-68.2-95.6-107.8-95.6-7.6 0-14.8 1.4-21.8 4.2-43.8 18-56.6 88-28.8 156.4 23.4 57.6 68.2 95.6 107.8 95.6 7.6 0 14.8-1.4 21.8-4.2z m-100-103.6c-11-27-14.8-56-10.6-79.2 3.4-18.2 11.4-31.2 22-35.4 3-1.2 6.2-1.8 9.8-1.8 11.6 0 25.8 6.6 39 18.4 16 14 29.8 34.4 39.2 57.4 22 54 12.2 105-11.4 114.6-3 1.2-6.2 1.8-9.8 1.8-11.6 0-25.8-6.6-39-18.4-16-14-30-34.4-39.2-57.4z' fill='currentColor'/>
    </svg>;
};

function splitAsciiLines(raw) {
    return String(raw || '').split('\n').map((line) => line.replace(/\s+$/g, ''));
}

function normalizeAsciiFrame(raw, width, height) {
    const lines = splitAsciiLines(raw);
    const normalizedLines = Array.from({length: height}).map((_, idx) => {
        const line = lines[idx] || '';
        return line.length > width ? line.slice(0, width) : line.padEnd(width, ' ');
    });
    return normalizedLines.join('\n');
}

function buildHeroAsciiFrames() {
    const rawFrames = [
        HERO_ASCII_HANYUAN_STANDARD,
        HERO_ASCII_READEMER0_STANDARD,
        HERO_ASCII_USHOULKDKNOW_STANDARD,
    ];
    const width = rawFrames.reduce((max, frame) => {
        const lineMax = splitAsciiLines(frame).reduce((m, line) => Math.max(m, line.length), 0);
        return Math.max(max, lineMax);
    }, 0);
    const height = rawFrames.reduce((max, frame) => Math.max(max, splitAsciiLines(frame).length), 0);
    const normalized = rawFrames.map((frame) => normalizeAsciiFrame(frame, width, height));
    return [
        {frame: normalized[0], weight: 90},
        {frame: normalized[1], weight: 6},
        {frame: normalized[2], weight: 4},
    ];
}

const experienceRelationPaletteMap = Object.freeze({
    ov: ['#55efc4', '#00cec9', '#81ecec'],
    tx: ['#e17055', '#ff7675', '#fab1a0'],
    msra: ['#0984e3', '#74b9ff'],
    deeproute: ['#6c5ce7', '#a29bfe'],
    default: ['#e84393', '#fd79a8'],
});
const backgroundScrollPaletteGroups = Object.freeze([
    ['#55efc4', '#00cec9', '#81ecec'],
    ['#e17055', '#ff7675', '#fab1a0'],
    ['#fdcb6e', '#ffeaa7', '#fdcb6e'],
    ['#0984e3', '#74b9ff', '#0984e3'],
    ['#e84393', '#fd79a8', '#e84393'],
    ['#6c5ce7', '#a29bfe', '#6c5ce7'],
]);
const backgroundDirectionTemplates = Object.freeze([
    {p1: '5% 0%', p2: '95% 10%', p3: '50% 110%'},
    {p1: '95% 0%', p2: '5% 10%', p3: '50% 110%'},
    {p1: '10% 92%', p2: '90% 8%', p3: '50% -10%'},
    {p1: '88% 88%', p2: '12% 12%', p3: '45% -8%'},
    {p1: '0% 50%', p2: '100% 50%', p3: '50% 105%'},
    {p1: '100% 50%', p2: '0% 50%', p3: '50% -5%'},
]);

function normalizeHexColor(hex) {
    const raw = String(hex || '').trim().replace('#', '');
    if (raw.length === 3) {
        return raw.split('').map((part) => `${part}${part}`).join('');
    }
    if (raw.length === 6) {
        return raw;
    }
    return '636e72';
}

function hexToRgbTuple(hex) {
    const normalized = normalizeHexColor(hex);
    const value = Number.parseInt(normalized, 16);
    if (Number.isNaN(value)) {
        return [99, 110, 114];
    }
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function interpolateHexColor(fromHex, toHex, ratio) {
    const t = clampNumber(ratio, 0, 1);
    const [fr, fg, fb] = hexToRgbTuple(fromHex);
    const [tr, tg, tb] = hexToRgbTuple(toHex);
    const r = Math.round(fr + ((tr - fr) * t));
    const g = Math.round(fg + ((tg - fg) * t));
    const b = Math.round(fb + ((tb - fb) * t));
    return rgbToHex(r, g, b);
}

function pickScrollPaletteColors(progressRatio, seed) {
    const groups = backgroundScrollPaletteGroups;
    if (!groups.length) {
        return ['#55efc4', '#74b9ff', '#fd79a8'];
    }
    const safeSeed = seed || {startGroup: 0, direction: 1, slotReverse: false};
    if (groups.length === 1) {
        return safeSeed.slotReverse ? [...groups[0]].reverse() : groups[0];
    }
    const safeProgress = clampNumber(progressRatio, 0, 1);
    const totalSteps = groups.length - 1;
    const step = Math.min(totalSteps, Math.floor(safeProgress * totalSteps));
    const local = (safeProgress * totalSteps) - step;
    const normalizedStart = ((safeSeed.startGroup % groups.length) + groups.length) % groups.length;
    const dir = safeSeed.direction >= 0 ? 1 : -1;
    const currentIndex = ((normalizedStart + (dir * step)) % groups.length + groups.length) % groups.length;
    const nextIndex = ((normalizedStart + (dir * (step + 1))) % groups.length + groups.length) % groups.length;
    const currentGroup = groups[currentIndex];
    const nextGroup = groups[nextIndex];
    const slots = safeSeed.slotReverse ? [2, 1, 0] : [0, 1, 2];
    return [0, 1, 2].map((slot) => {
        const slotIndex = slots[slot];
        const fromColor = currentGroup[slotIndex % currentGroup.length];
        const toColor = nextGroup[slotIndex % nextGroup.length];
        return interpolateHexColor(fromColor, toColor, local);
    });
}

function seededUnit(seedBase, index, salt) {
    const n = (seedBase * 12.9898) + ((index + 1) * 78.233) + ((salt + 1) * 37.719);
    const value = Math.sin(n) * 43758.5453;
    return value - Math.floor(value);
}

function getBackgroundGlowCount(width) {
    const safeWidth = Math.max(320, Number(width) || 0);
    if (safeWidth >= 1900) {
        return 7;
    }
    if (safeWidth >= 1500) {
        return 6;
    }
    if (safeWidth >= 1100) {
        return 5;
    }
    if (safeWidth >= 760) {
        return 4;
    }
    return 3;
}

function buildBackgroundGlowLayout(width, seed) {
    const safeWidth = clampNumber(Number(width) || 1366, 360, 2560);
    const count = getBackgroundGlowCount(safeWidth);
    const direction = seed?.direction >= 0 ? 1 : -1;
    const baseSeed = ((seed?.startGroup || 0) * 31)
        + (seed?.slotReverse ? 67 : 19)
        + (direction > 0 ? 43 : 97)
        + Math.round((seed?.layoutSeed || 0.5) * 1000);
    return Array.from({length: count}).map((_, idx) => {
        const logicalIdx = direction > 0 ? idx : (count - 1 - idx);
        const ratio = count === 1 ? 0.5 : (logicalIdx / (count - 1));
        const baseX = ratio * 100;
        const jitterX = (seededUnit(baseSeed, idx, 1) - 0.5) * 28;
        const lane = idx % 3;
        const baseY = lane === 0 ? 8 : lane === 1 ? 46 : 92;
        const jitterY = (seededUnit(baseSeed, idx, 2) - 0.5) * 38;
        const x = clampNumber(baseX + jitterX, -12, 112);
        const y = clampNumber(baseY + jitterY, -14, 114);
        const sizeScale = 0.72 + (seededUnit(baseSeed, idx, 3) * 0.78);
        const widthPx = Math.round(clampNumber((safeWidth * (0.34 + ((idx % 2) * 0.04))) * sizeScale, 540, 1920));
        const heightPx = Math.round(clampNumber(widthPx * (0.58 + (seededUnit(baseSeed, idx, 4) * 0.34)), 420, 1300));
        const stop = Math.round(clampNumber(52 + (seededUnit(baseSeed, idx, 5) * 14), 50, 72));
        const alpha = Number(clampNumber(0.34 + (seededUnit(baseSeed, idx, 6) * 0.24), 0.3, 0.62).toFixed(3));
        return {x, y, width: widthPx, height: heightPx, stop, alpha};
    });
}

function buildBackgroundGlowPalette(baseColors, count, seed) {
    const fallback = ['#55efc4', '#74b9ff', '#fd79a8'];
    const source = Array.isArray(baseColors) && baseColors.length >= 3 ? baseColors : fallback;
    const reverse = Boolean(seed?.slotReverse);
    return Array.from({length: count}).map((_, idx) => {
        const ratio = count === 1 ? 0.5 : (idx / (count - 1));
        const t = reverse ? 1 - ratio : ratio;
        if (t <= 0.5) {
            return interpolateHexColor(source[0], source[1], t * 2);
        }
        return interpolateHexColor(source[1], source[2], (t - 0.5) * 2);
    });
}

function hexToRgba(hex, alpha) {
    const value = String(hex || '').replace('#', '');
    const normalized = value.length === 3 ? value.split('').map((c) => `${c}${c}`).join('') : value;
    const intVal = Number.parseInt(normalized, 16);
    if (Number.isNaN(intVal)) {
        return `rgba(99, 110, 114, ${alpha})`;
    }
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getRelationLinePalette(experienceId, relationIndex) {
    const group = experienceRelationPaletteMap[experienceId] || experienceRelationPaletteMap.default;
    const start = group[relationIndex % group.length];
    const end = group[(relationIndex + 1) % group.length];
    return {start, end, glow: hexToRgba(end, 0.72)};
}

function splitAchievementNote(note) {
    const raw = String(note || '').trim();
    if (!raw) {
        return {period: '', detail: ''};
    }
    const normalized = raw.replace(/\s+/g, ' ');
    const periodMatch = normalized.match(/^(\d{4}\.\d{2}\s*-\s*(?:\d{4}\.\d{2}|Present|至今|現在))(?:\s*·\s*(.*))?$/u);
    if (periodMatch) {
        return {
            period: periodMatch[1].replace(/\s*-\s*/g, '-'),
            detail: (periodMatch[2] || '').trim(),
        };
    }
    const parts = normalized.split('·').map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1 && /\d{4}/.test(parts[0])) {
        return {period: parts[0], detail: parts.slice(1).join(' · ')};
    }
    return {period: '', detail: normalized};
}

function getCurrentMonthIndex() {
    const now = new Date();
    return (now.getFullYear() * 12) + (now.getMonth() + 1);
}

function formatMonthIndex(monthIndex) {
    if (!Number.isFinite(monthIndex)) {
        return '';
    }
    const year = Math.floor((monthIndex - 1) / 12);
    const month = monthIndex - (year * 12);
    return `${String(year).padStart(4, '0')}.${String(month).padStart(2, '0')}`;
}

function parsePeriodRange(period) {
    const match = String(period || '').match(/(\d{4})\.(\d{2})\s*-\s*(\d{4}\.\d{2}|Present|至今|現在)/iu);
    if (!match) {
        return null;
    }
    const startYear = Number(match[1]);
    const startMonth = Number(match[2]);
    if (!Number.isFinite(startYear) || !Number.isFinite(startMonth)) {
        return null;
    }
    const startMonthIndex = (startYear * 12) + startMonth;
    const endRaw = match[3];
    let endMonthIndex = Number.NaN;
    let isPresent = false;
    if (/^(Present|至今|現在)$/iu.test(endRaw)) {
        endMonthIndex = getCurrentMonthIndex();
        isPresent = true;
    } else {
        const endMatch = endRaw.match(/(\d{4})\.(\d{2})/u);
        if (!endMatch) {
            return null;
        }
        const endYear = Number(endMatch[1]);
        const endMonth = Number(endMatch[2]);
        if (!Number.isFinite(endYear) || !Number.isFinite(endMonth)) {
            return null;
        }
        endMonthIndex = (endYear * 12) + endMonth;
    }
    const normalizedEnd = Math.max(startMonthIndex, endMonthIndex);
    return {
        startMonthIndex,
        endMonthIndex: normalizedEnd,
        durationMonths: Math.max(1, (normalizedEnd - startMonthIndex) + 1),
        isPresent,
    };
}

function parseRoleAndDepartment(rawRole) {
    const parts = String(rawRole || '').split('·').map((part) => part.trim()).filter(Boolean);
    if (!parts.length) {
        return {
            roleTitle: '',
            roleDepartment: '',
        };
    }
    if (parts.length === 1) {
        return {
            roleTitle: parts[0],
            roleDepartment: '',
        };
    }
    return {
        roleTitle: parts[0],
        roleDepartment: parts.slice(1).join(' · '),
    };
}

const experienceRelationMap = Object.freeze({
    ov: ['ovreco', 'bilm'],
    tx: ['reco', 'aipipe', 'xingtong'],
    msra: ['carbon', 'iotml'],
    deeproute: ['planner'],
});

const experienceCompanyHomepageMap = Object.freeze({
    tx: 'https://www.tencent.com/',
    msra: 'https://www.microsoft.com/en-us/research/lab/microsoft-research-asia/',
    deeproute: 'https://www.deeproute.ai/',
});

const experienceVisualMap = Object.freeze({
    tx: {
        iconKey: '',
        iconFallback: '🐧',
        cardBgImage: '/ushouldknow-icons/tencent-official.png',
        cardBgOpacity: 0.14,
        cardBgSaturate: 0.92,
    },
    msra: {
        iconKey: 'msra-icon',
        cardBgImage: '/ushouldknow-icons/msra.png',
        cardBgOpacity: 0.14,
        cardBgSaturate: 0.92,
    },
    deeproute: {
        iconKey: 'deeproute-icon',
        cardBgImage: '/ushouldknow-icons/deeproute.png',
        cardBgOpacity: 0.08,
        cardBgSaturate: 0.7,
    },
});

function getExperienceLinks(experienceId) {
    const links = experienceRelationMap[experienceId];
    return Array.isArray(links) ? links : [];
}

function getExperienceCompanyHomepage(experienceId) {
    return experienceCompanyHomepageMap[experienceId] || '';
}

function getExperienceVisual(experienceId) {
    return experienceVisualMap[experienceId] || {};
}

const REPO_LINKS = Object.freeze({
    profile: 'https://github.com/boogieLing?tab=repositories',
    websiteScreen: 'https://github.com/boogieLing/r0website_screen',
    websiteServer: 'https://github.com/boogieLing/r0website_server',
    es: 'https://github.com/boogieLing/r0_es',
    redis: 'https://github.com/boogieLing/r0redis',
    mongo: 'https://github.com/boogieLing/r0mongo',
    swimAD: 'https://github.com/boogieLing/swimAD',
    linearMultiheadAttention: 'https://github.com/boogieLing/Linear-Multihead-Attention',
    docWatcher: 'https://github.com/boogieLing/r0_doc_watcher',
    scripts: 'https://github.com/boogieLing/Answer-script-for-Unipus',
    osFifoLru: 'https://github.com/boogieLing/OS_FIFO_LRU',
});

const contentMap = {
    en: {
        subtitle: 'Full-stack engineer focused on algorithmic modeling and production systems.',
        progressFaces: ['(•̀ᴗ•́)و', '^_^', '(๑˃̵ᴗ˂̵)', '(づ｡◕‿‿◕｡)づ', '(=^･ω･^=)', '(✧ω✧)'],
        profileFactsTop: ['凌瀚远', AGE_TOKEN, 'OpenVision Algorithm Lead'],
        profileFactsBottom: ['Full Stack Engineer', 'Algorithm-Driven', 'Photographer', 'Calligrapher (Lingnan School)'],
        summaryRibbon: [
            {id: 'ov', title: 'OpenVision · Algorithm Lead', detail: 'Led algorithm and data architecture for global gaming workflows.', stack: 'Recommendation · Risk Modeling · Backend'},
            {id: 'tx', title: 'Tencent IEG · Backend & AIGC Initiative Lead', detail: 'Led backend delivery for recommendation, review and incentive systems, and drove the AIGC initiative.', stack: 'Backend Systems · Recommendation Business · AIGC Program Leadership'},
            {id: 'fullstack', title: 'Full-stack Systems Engineering', detail: 'Delivered end-to-end systems across frontend, backend, middleware, realtime services, and observability.', stack: 'Architecture Design · Multi-level Cache · Observability'},
            {id: 'aigc', title: 'LLM / AIGC Engineering', detail: 'Built deployable LLM/RAG and multimodal pipelines with agent workflow and context engineering.', stack: 'RAG · Agent Loop · Context Engineering'},
        ],
        sectionTitles: {stack: 'Full Stack Matrix', milestones: 'Milestones', projects: 'Flagship Projects'},
        scenes: [{id: 'boot', points: ['Tencent IEG (2022-2025)', 'OpenVision Algorithm Lead (2025-now)']}],
        introExperiences: [
            {id: 'ov', company: 'OpenVision', iconKey: 'openvision', iconFallback: '🦄', role: 'Algorithm Lead · Global Site & Fantasy Studio', period: '2025.08-Present', tags: ['Algorithm Roadmap', 'Team Building', 'Game Economy Modeling', 'Tag Governance & Data Assetization', 'User Segmentation Recommendation', 'Risk-aware Pacing Control', 'Unified Data/Algo Pipeline', 'Lottery & Leaderboard Backend']},
            {id: 'tx', company: 'Tencent Technology (Shenzhen) Co., Ltd.', iconKey: 'tencent', iconFallback: '🏢', role: 'Backend Engineer · IEG Interactive Entertainment Group', period: '2022.07-2025.08', tags: ['Independent Algo Project Delivery', 'AIGC Pilot Core Member', 'LLM/RAG/Multimodal Landing', 'KOL Incentive Platform End-to-end', 'Recommendation & Risk Review System', 'OCR / Revenue Estimation Modeling', 'Social Graph Multi-level Scoring', 'Delay Queue & Infra Engineering']},
            {id: 'msra', company: 'Microsoft Research Asia', iconKey: 'msra', iconFallback: '🔬', role: 'Algorithm Researcher · Machine Learning Group · Project-Based', period: '2021.12-2022.06', tags: ['Carbon-neutral Policy Simulation', 'RL Decision Agent', 'MDP State/Action Design', 'Reward Shaping for Delayed Feedback', 'DQN/PPO Comparative Training', 'Causal Graph + do-calculus Explainability']},
            {id: 'deeproute', company: 'DeepRoute.ai', iconKey: 'deeproute', iconFallback: '🚗', role: 'Software Development Engineer · Cloud Computing / Path Planning', period: '2021.06-2021.12', tags: ['Behavior + Path Planning', 'Unprotected Left Turn / Roundabout Rules', 'Intersection Collaborative Driving', 'State Machine + Rule Engine', 'HD Map + Sensor Fusion', 'A* / Sampling / Trajectory Optimization']},
        ],
        introAchievements: [
            {id: 'ovreco', project: 'Global Recommendation: Rhythm-Aware Constrained Optimization', outcome: 'Improved retention and paid conversion while controlling risk and pacing.', note: '2025.09-Present · Segmentation + Sequence Modeling + Multi-objective Ranking', labels: ['User Segmentation', 'Behavior Sequence', 'Multi-objective Ranking', 'Risk-aware Recommendation', 'Lifecycle Constraints', 'Strategy Orchestration']},
            {id: 'reco', project: 'KOL Smart Selection: Multi-Recall & Social Collaborative Recommendation', outcome: 'Recall hit rate >=85%; Feed CTR +23%; joint recommendation covers >30% scenarios.', note: '2024.06-2025.07 · Multi-link Recall + Circle Dispatch + Strategy Orchestration', labels: ['Multi-link Recall', 'Dual-Tower', 'Similarity Ranking', 'Social Graph', 'Feed Flow', 'Cross-circle Strategy']},
            {id: 'bilm', project: 'BILM High-Performance Relation Index & Persistence (Go)', outcome: 'Validated at 30M largeID / 500 smallID with high query performance and DB-grade reliability.', note: '2025.11-2026.02 · RoaringBitmap + Snapshot/Delta/WAL', labels: ['RoaringBitmap', 'WAL', 'Snapshot', 'CRC Validation', 'Incremental Snapshot', 'In-memory Database']},
            {id: 'aipipe', project: 'Automated Data Analysis Pipeline', outcome: 'Inference cost -60%+, Recall +10.7%, replaced >70% junior analyst workload.', note: '2023.03-2024.07 · LATM ToolMaker/ToolUser + Private Sandbox', labels: ['LLM', 'ToolMaker/ToolUser', 'LATM', 'Prompt Engineering', 'Private Sandbox', 'Data Security']},
            {id: 'xingtong', project: 'Xingtong text2motion Generation Pipeline', outcome: 'Bilingual generation success rate >=80%, with 3 live 3D runs at 0 bug.', note: '2023.02-2024.07 · LLM/RAG + CLIP/MotionCLIP + Pose Synthesis', labels: ['LLM Prompting', 'RAG', 'CLIP/MotionCLIP', 'Fantasia3D/DragGAN', 'SAM + DINO', 'Bilingual Generation']},
            {id: 'carbon', project: 'Carbon-Neutral Policy Simulation via RL', outcome: 'Best policy achieved emissions -18%, social cost -12%, and volatility -21%.', note: '2022.02-2022.06 · DQN/PPO + Reward Shaping + Causal Inference', labels: ['Reinforcement Learning', 'Policy Optimization', 'MDP', 'Reward Shaping', 'Causal Graph', 'do-calculus']},
            {id: 'iotml', project: 'Machine-Learning IoT Control System', outcome: 'Feature dimension -13%, recall +10%, software copyright granted.', note: '2019.06-2021.03 · Transformer + Multi-feature Fusion + Arduino/ROS/ZigBee', labels: ['Transformer Time Series', 'Multi-feature Fusion', 'Arduino/ROS', 'I2C/ZigBee', 'IoT Control & Alerting']},
            {id: 'planner', project: 'Autonomous Planning Module', outcome: 'Rule + optimization path planning for lane-change/turn/junction scenarios.', note: '2021.06-2021.12 · Cloud + Planning + Optimization', labels: ['Autonomous Driving', 'Path Planning', 'Control', 'Safety']},
        ],
        capabilityTracks: [
            {
                id: 'reco',
                name: 'Recommendation & Strategy Modeling',
                value: 94,
                summary: 'User-state segmentation, ML ranking, and constrained profit optimization.',
                details: ['Rule cohorts with K-Means/GMM confidence calibration', 'Learning-to-rank: Wide&Deep, FM/DeepFM, CTR/CVR, sequence features', 'Six-path recall + social graph collaborative recommendation', 'Constrained reranking over revenue, novelty, immersion, and risk'],
            },
            {
                id: 'llm',
                name: 'LLM / AIGC System Engineering',
                value: 92,
                summary: 'Prompt orchestration, efficient attention design, and multimodal pipeline implementation.',
                details: ['LLM + RAG + CLIP/MotionCLIP for text2motion generation', 'Linformer reproduction for linear-complexity attention engineering', 'Inner-loop agent design with planner/executor/reviewer cycles', 'Context engineering: memory compaction, retrieval routing, prompt budget control', 'Private sandbox + desensitization + policy guardrails'],
            },
            {
                id: 'fullstack',
                name: 'Full-stack Product Engineering',
                value: 95,
                summary: 'End-to-end delivery across frontend, backend, middleware, cloud runtime, and real-time streaming services.',
                details: ['C++-rooted engineering foundation: performance/memory awareness and cross-language service integration', 'Microservice decomposition, boundary design, and service governance', 'Multi-level cache (local + Redis + DB) with consistency and downgrade strategy', 'Pattern-oriented backend design (strategy/factory/pipeline/state machine)', 'Real-time streaming architecture: WebSocket transport, async event pipelines, backpressure handling, and alert orchestration', 'Frontend/backend integration, observability, CI/CD, reliability'],
            },
            {
                id: 'algoData',
                name: 'Algorithm & Data Intelligence',
                value: 91,
                summary: 'Combines ACM rigor, ML/RL modeling, CV risk detection, and data governance system design.',
                details: ['Algorithm foundation: DP, graph search, greedy optimization, complexity control', 'Intelligent modeling: RL (DQN/PPO/MDP), causal inference, Bayesian optimization', 'Computer-vision decision pipeline design: geometric alignment, multi-target tracking lifecycle, and rule-based risk judgment', 'Data governance: metric standards, quality rules, lineage, metadata, access policy', 'Data lifecycle: ingestion-modeling-serving-monitoring-feedback loop'],
            },
        ],
        resumeDomains: [
            {
                id: 'fullstack',
                title: 'Full-stack Delivery',
                points: ['Frontend interaction + backend services + infra linkage', 'Multi-role process systems (KOL/content/MCN/task)', 'Can lead delivery from requirement to online iteration'],
                github: REPO_LINKS.websiteScreen,
            },
            {
                id: 'algorithm',
                title: 'Algorithm Strategy',
                points: ['Recommendation/segmentation/risk control strategy integration', 'Supports long-term yield targets with lifecycle constraints', 'Balances explainability and engineering operability'],
                github: REPO_LINKS.profile,
            },
            {
                id: 'llm',
                title: 'LLM & Multimodal',
                points: ['LLM/RAG/AIGC pipeline implementation experience', 'Prompt chains + tool orchestration + sandbox safety', 'Text, image and motion generation workflows'],
                github: REPO_LINKS.profile,
            },
            {
                id: 'research',
                title: 'Research Foundation',
                points: ['RL policy simulation with causal inference', 'Policy explainability for cross-team acceptance', 'Can migrate research logic into production strategy'],
                github: REPO_LINKS.profile,
            },
            {
                id: 'engineeringAssets',
                title: 'Youkeai KOL Incentive Platform',
                points: ['Owned backend delivery of a full-chain, multi-end KOL incentive platform at Tencent IEG', 'Covered KOL/content/MCN/task subsystems with role- and process-oriented orchestration', 'Supported end-to-end management across task and content dimensions with permission workflows'],
                github: REPO_LINKS.profile,
            },
        ],
        projectHighlights: [
            {
                title: 'Global Recommendation: Rhythm-Aware Constrained Optimization',
                desc: 'Segmentation + sequence signals + risk constraints for retention/conversion growth with pacing protection.',
                metric: 'Long-term revenue optimization under risk control',
                labels: ['User Segmentation', 'State Priority', 'Multi-objective Ranking'],
                github: REPO_LINKS.profile,
            },
            {
                title: 'BILM High-Performance Relation Index (Go)',
                desc: 'Primary bitmap index + WAL/Snapshot/Delta persistence chain for 30M-scale relation serving.',
                metric: '30M largeID validated',
                labels: ['RoaringBitmap', 'WAL/CRC', 'Incremental Snapshot'],
                github: REPO_LINKS.profile,
            },
            {
                title: 'Automated Data Analysis Pipeline (LLM)',
                desc: 'ToolMaker/ToolUser + private sandbox to automate extraction, visualization and analysis.',
                metric: 'Inference -60%+ / Recall +10.7%',
                labels: ['LATM', 'Prompt Engineering', 'Data Security'],
                github: REPO_LINKS.profile,
            },
            {
                title: 'swimAD: Multi-view Drowning Alert System',
                desc: 'Python real-time pipeline with YOLO detection, 4-view homography association, OCSORT lifecycle tracking, and event-ID-based alert delivery.',
                metric: '4-view fusion + 9-rule risk detection + throttled push workflow',
                labels: ['Tornado/WebSocket', 'YOLO + BoxMOT/OCSORT', 'Rule Engine', 'Event Logging'],
                github: REPO_LINKS.swimAD,
            },
            {
                title: 'Linear-Multihead-Attention (Linformer Reproduction)',
                desc: 'Reproduced Linformer-style linear multi-head attention and verified engineering implementation details for efficient Transformer attention.',
                metric: 'Linear-complexity attention reproduction practice',
                labels: ['PyTorch', 'Transformer', 'Linformer', 'Linear Attention'],
                github: REPO_LINKS.linearMultiheadAttention,
            },
            {
                title: 'Personal Website Twin-Repo Architecture',
                desc: 'r0website_screen + r0website_server form an end-to-end personal product stack covering blog/content workflow and runtime services.',
                metric: 'Continuous personal product iteration',
                labels: ['React/MobX', 'Go', 'MongoDB', 'CRACO'],
                github: REPO_LINKS.websiteScreen,
            },
            {
                title: 'Data Middleware Toolkit Suite',
                desc: 'r0redis, r0mongo, and r0_es provide operation-oriented helpers for data middleware lifecycle and routine tasks.',
                metric: 'Unified helper toolset for Redis/Mongo/Elasticsearch',
                labels: ['Redis', 'MongoDB', 'Elasticsearch', 'Python'],
                github: REPO_LINKS.es,
            },
            {
                title: 'Docs Auto Generator (r0_doc_watcher)',
                desc: 'Linux inode-based file watching and Sphinx-oriented documentation generation workflow for engineering docs maintenance.',
                metric: 'Automated doc generation pipeline',
                labels: ['C++', 'Python', 'Linux inode', 'Sphinx'],
                github: REPO_LINKS.docWatcher,
            },
            {
                title: 'Automation Script Cluster',
                desc: 'Task automation scripts for repetitive web workflows, emphasizing scriptability, robustness, and maintainability.',
                metric: 'Manual repetitive workload reduction',
                labels: ['Python', 'Browser Automation', 'Workflow Script'],
                github: REPO_LINKS.scripts,
            },
            {
                title: 'Youkeai: Multi-end KOL Incentive Platform Backend',
                desc: 'Implemented backend chains for KOL/content/MCN/incentive tasks with multi-role authority and process governance.',
                metric: 'Full-chain incentive platform delivery',
                labels: ['Backend Platform', 'Workflow Engine', 'Permission Model', 'Task Orchestration'],
                github: REPO_LINKS.profile,
            },
        ],
        wins: [
            {id: 'ccpc-changchun', label: 'CCPC Changchun Regional', medal: 'Bronze', emoji: '🥉', color: '#cd7f32'},
            {id: 'ccpc-weihai', label: 'CCPC Weihai Regional', medal: 'Bronze', emoji: '🥉', color: '#b87333'},
            {id: 'icpc-shanghai', label: 'ICPC Asia Shanghai Regional', medal: 'Iron', emoji: '⚙️', color: '#7f8c8d'},
            {id: 'icpc-jinan', label: 'ICPC Asia Jinan Regional', medal: 'Silver', emoji: '🥈', color: '#c0c0c0'},
        ],
    },
};

contentMap.zh = {
    ...contentMap.en,
    subtitle: '全栈工程师，聚焦算法建模与工程系统实现。',
    profileFactsTop: ['凌瀚远', AGE_TOKEN, 'OpenVision 算法负责人'],
    profileFactsBottom: ['全栈工程师', '算法驱动', '摄影师', '书法家（岭南画派）'],
    summaryRibbon: [
        {id: 'ov', title: 'OpenVision · 算法负责人', detail: '负责全球站与 Fantasy 场景的算法与数据体系设计。', stack: '推荐策略 · 数据治理 · 代数系统'},
        {id: 'tx', title: '腾讯 IEG · 后端研发与 AIGC 专项领头', detail: '负责后端核心链路研发，覆盖推荐、内容审查与激励平台，并领头推进 AIGC 专项。', stack: '后端系统 · 推荐业务 · AIGC 专项'},
        {id: 'fullstack', title: '全栈系统工程', detail: '负责前后端到中间件的端到端系统交付，覆盖实时链路与可观测性体系。', stack: '架构设计 · 多级缓存 · 可观测性'},
        {id: 'aigc', title: 'LLM / AIGC 工程化', detail: '构建可部署的 LLM/RAG 与多模态处理流程，并落地 Agent 工作流与上下文工程。', stack: 'RAG · Agent 闭环 · 上下文工程'},
    ],
    sectionTitles: {stack: '全栈矩阵', milestones: '里程碑', projects: '核心项目'},
    scenes: [{id: 'boot', points: ['腾讯 IEG (2022-2025)', 'OpenVision 算法负责人 (2025-至今)']}],
    introExperiences: [
        {id: 'ov', company: '敞亮科技有限公司 OpenVision', iconKey: 'openvision', iconFallback: '🦄', role: '算法负责人 · 全球站 & Fantasy 游戏工作室', period: '2025.08-至今', tags: ['算法与数据体系统筹', '算法方向规划与团队搭建', '游戏数值算法设计/验证/落地', '标签治理与数据资产化', '用户分群推荐策略', '风险建模与节奏控制', '统一数据/算法管道', '彩球抽奖/排行榜后端']},
        {id: 'tx', company: '深圳市腾讯计算机系统有限公司', iconKey: 'tencent', iconFallback: '🏢', role: '后台研发工程师 · IEG互动娱乐事业群', period: '2022.07-2025.08', tags: ['独立算法项目研发', '达人智选/Feed流推荐', '内容风格聚类与风险审查', 'AIGC 中台专项核心成员', 'LLM/RAG/多模态业务落地', '游可爱 KOL 激励平台后端', 'Text2SQL 微调与数据分析管线', '延迟队列与基础设施开发']},
        {id: 'msra', company: '微软亚洲研究院（MSRA）', iconKey: 'msra', iconFallback: '🔬', role: '算法研究员 · Machine Learning组 · 项目制', period: '2021.12-2022.06', tags: ['碳中和政策模拟', '强化学习决策智能体', 'MDP 状态/动作空间设计', '延迟反馈奖励塑形', 'DQN/PPO 多策略对比', '因果图 + do-calculus 可解释输出']},
        {id: 'deeproute', company: '深圳市元戎启行有限公司', iconKey: 'deeproute', iconFallback: '🚗', role: '软件开发工程师（实习）· 云计算 / 路径规划', period: '2021.06-2021.12', tags: ['行为规划 + 路径规划', '无保护左转/环岛规则', '交叉路口协同行驶', '状态机 + 规则引擎', 'HD Map + 感知融合', 'A* / 采样优化 / 轨迹优化']},
    ],
    introAchievements: [
        {id: 'ovreco', project: '全球站推荐：用户节奏感知的受约束收益优化推荐', outcome: '在风险可控前提下实现留存与付费转化提升，并平衡长期用户体验。', note: '2025.09-至今 · 用户分群 + 行为序列建模 + 多目标排序', labels: ['用户分群', '行为序列建模', '状态优先级机制', '多目标排序', '风险感知推荐', '生命周期约束']},
        {id: 'reco', project: '达人智选：多链路召回与社交协同驱动的 KOL 智能推荐', outcome: '召回命中率 >=85%，Feed CTR +23%，联合推荐覆盖超 30% 任务场景。', note: '2024.06-2025.07 · 多链路召回 + 圈层分发 + 社交图联合推荐', labels: ['六链路召回', '双塔模型', '最大中心度贪心迁移', 'Feed流推荐', '社交图联合推荐', '20+ 游戏项目组接入']},
        {id: 'bilm', project: 'BILM 高性能关系索引与持久化系统（Go）', outcome: '在 largeID 3000 万 / smallID 500 级别完成验证，兼顾性能、可靠性与成本优势。', note: '2025.11-2026.02 · RoaringBitmap + Snapshot/Delta/WAL', labels: ['RoaringBitmap', 'WAL先写', 'Snapshot + Delta', 'CRC校验', '增量快照', '关系代数运算']},
        {id: 'aipipe', project: '自动化数据分析管线', outcome: '推理成本下降逾 60%，召回率提升 10.7%，可替代初级分析师工时超 70%。', note: '2023.03-2024.07 · LATM ToolMaker/ToolUser + 私有沙箱', labels: ['LLM', 'ToolMaker/ToolUser', 'LATM', 'Prompt编排', '私有化沙箱', '数据安全脱敏']},
        {id: 'xingtong', project: '星瞳 text2motion 动作生成系统', outcome: '中英双语动作生成成功率 >=80%，完成 3 次直播 3D 回 0 bug 运行。', note: '2023.02-2024.07 · LLM/RAG + CLIP/MotionCLIP + Fantasia3D', labels: ['LLM 指令解析', '动作检索', '姿态修正', 'SAM + DINO', 'DragGAN/Fantasia3D', '双语生成']},
        {id: 'carbon', project: '基于强化学习的碳中和政策模拟系统', outcome: '最优策略实现碳排放 -18%、社会成本 -12%、策略波动性 -21%。', note: '2022.02-2022.06 · DQN/PPO + 奖励塑形 + 因果推断', labels: ['强化学习', '政策优化', 'MDP', '奖励函数设计', '因果图', 'do-calculus']},
        {id: 'iotml', project: '基于机器学习的物联网控制系统', outcome: '有效特征维度下降 13%，召回率平均提升 10%，并取得软著 2020SR0568084。', note: '2019.06-2021.03 · Transformer + 多特征融合 + Arduino/ROS', labels: ['Transformer时序预测', '多特征融合', 'Arduino/ROS', 'i2c/ZigBee', '自动化告警控制', '软件著作权']},
        {id: 'planner', project: '自动驾驶行为规划与路径规划模块', outcome: '完成无保护左转、路口协同、环岛通行与变道约束等关键规则与候选路径生成。', note: '2021.06-2021.12 · 规则引擎 + 状态机 + 轨迹优化', labels: ['行为决策逻辑', '规则引擎', 'HD Map + 感知融合', 'A* 与采样优化', '轨迹优化', '鲁棒性增强']},
    ],
    capabilityTracks: [
        {
            id: 'reco',
            name: '推荐策略与收益优化',
            value: 87,
            summary: '围绕用户状态分群、机器学习排序与受约束收益优化。',
            details: ['规则分群 + K-Means/GMM 置信校验机制', '学习排序体系：Wide&Deep、FM/DeepFM、CTR/CVR、序列特征', '六链路召回 + 社交图协同推荐', '在收益、沉浸、新颖度与风险敞口间进行受约束重排'],
        },
        {
            id: 'llm',
            name: 'LLM / AIGC 系统工程',
            value: 81,
            summary: '覆盖文本与多模态场景，并具备注意力效率优化能力的 LLM 工程闭环。',
            details: ['LLM + RAG + CLIP/MotionCLIP 动作生成链路', 'Linear-Multihead-Attention（Linformer）复现，具备线性复杂度注意力实现经验', '内环 Agent 设计：规划-执行-校验-回退的闭环机制', '上下文工程：记忆压缩、检索路由、Prompt 预算与窗口治理', '私有沙箱 + 数据脱敏 + 策略护栏保障安全执行'],
        },
        {
            id: 'fullstack',
            name: '全栈系统工程能力',
            value: 91,
            summary: '前端、后端、中间件、云上运行与实时流式服务的一体化交付能力。',
            details: ['C++ 工程底色：关注性能/内存细节与跨语言服务协同集成', '微服务架构拆分、边界建模与服务治理能力', '多级缓存设计（本地缓存 + Redis + DB）与一致性/降级策略', '面向设计模式的后端工程实现（策略/工厂/责任链/状态机）', '实时流式架构能力：WebSocket 传输、异步事件管道、背压处理与告警编排', '端到端工程能力：前后端联调、可观测性、CI/CD 与稳定性保障'],
        },
        {
            id: 'algoData',
            name: '算法与数据智能能力',
            value: 92,
            summary: '融合 ACM 传统算法、机器学习/强化学习、视觉风险判定与数据治理体系。',
            details: ['传统算法：DP、图算法、贪心、搜索与复杂度控制', '智能算法：ML（LSTM/Transformer）、RL（DQN/PPO/MDP）、因果推断、贝叶斯优化', '视觉决策链路设计：几何对齐、多目标跟踪生命周期建模与规则驱动风险判定', '数据治理：指标标准、质量规则、血缘追踪、元数据与权限治理', '数据全链路能力：采集-建模-服务-监控-反馈闭环'],
        },
    ],
    resumeDomains: [
        {
            id: 'fullstack',
            title: '全栈交付能力',
            points: ['前端交互、后端服务、基础设施可一体化协同', '可负责从需求拆解到上线迭代的全流程', '多角色/多端系统的复杂流程治理经验'],
            github: REPO_LINKS.websiteScreen,
        },
        {
            id: 'algorithm',
            title: '算法策略能力',
            points: ['推荐/风控/分群策略可直接对业务指标负责', '强调长期收益与用户生命周期约束', '兼顾可解释性与策略可运营性'],
            github: REPO_LINKS.profile,
        },
        {
            id: 'llm',
            title: '大模型与多模态',
            points: ['LLM/RAG/AIGC 业务化链路搭建经验', 'Prompt 链路 + 工具编排 + 沙箱安全闭环', '文本、图像、动作生成等多模态实践'],
            github: REPO_LINKS.profile,
        },
        {
            id: 'research',
            title: '研究到工程迁移',
            points: ['强化学习策略优化与因果推断经验', '可解释输出支撑跨部门协作决策', '具备把研究方法工程化的落地能力'],
            github: REPO_LINKS.profile,
        },
        {
            id: 'engineeringAssets',
            title: '游可爱 KOL 激励平台建设',
            points: ['在腾讯 IEG 主导游可爱项目后端建设，完成全链路多端激励平台交付', '覆盖 KOL、内容、MCN、激励任务等核心子系统并形成统一流程', '支持多角色权限治理与任务/内容双维度全流程管理'],
            github: REPO_LINKS.profile,
        },
    ],
    projectHighlights: [
        {
            title: '全球站推荐：受约束收益优化系统',
            desc: '用户分群 + 行为序列 + 风险硬约束，兼顾留存/付费与长期节奏保护。',
            metric: '长期收益最大化（风险可控）',
            labels: ['分群建模', '状态优先级', '多目标排序'],
            github: REPO_LINKS.profile,
        },
        {
            title: 'BILM 高性能关系索引（Go）',
            desc: 'RoaringBitmap 主索引 + WAL/Snapshot/Delta 持久化，面向 30M 级关系服务。',
            metric: 'largeID 3000 万级验证',
            labels: ['RoaringBitmap', 'WAL/CRC', '增量快照'],
            github: REPO_LINKS.profile,
        },
        {
            title: '自动化数据分析管线（LLM）',
            desc: 'ToolMaker/ToolUser + 私有沙箱，自动化完成提取、可视化与洞察输出。',
            metric: '推理成本 -60%+ / 召回 +10.7%',
            labels: ['LATM', 'Prompt编排', '数据安全'],
            github: REPO_LINKS.profile,
        },
        {
            title: 'swimAD：多视角溺水实时告警系统',
            desc: '基于 Python 的实时链路，打通 YOLO 检测、4 视角单应融合、OCSORT 轨迹生命周期与告警推送。',
            metric: '4视角融合 + 9规则风险判定 + 事件ID闭环',
            labels: ['Tornado/WebSocket', 'YOLO + BoxMOT/OCSORT', '规则引擎', '事件日志'],
            github: REPO_LINKS.swimAD,
        },
        {
            title: 'Linear-Multihead-Attention（Linformer 复现）',
            desc: '复现 Linformer 提出的 Linear Multi-head Attention，实现并验证线性复杂度注意力机制的工程细节。',
            metric: '线性复杂度注意力机制复现实践',
            labels: ['PyTorch', 'Transformer', 'Linformer', 'Linear Attention'],
            github: REPO_LINKS.linearMultiheadAttention,
        },
        {
            title: '个人站点双仓架构（r0website_screen + r0website_server）',
            desc: '形成前后端一体化的个人产品体系，覆盖内容系统、交互展示与服务运行链路。',
            metric: '持续演进的个人产品工程',
            labels: ['React/MobX', 'Go', 'MongoDB', 'CRACO'],
            github: REPO_LINKS.websiteScreen,
        },
        {
            title: '数据中间件工具链（r0redis / r0mongo / r0_es）',
            desc: '围绕 Redis、Mongo、Elasticsearch 构建运维与开发辅助工具，提升日常操作效率。',
            metric: '中间件统一辅助能力',
            labels: ['Redis', 'MongoDB', 'Elasticsearch', 'Python'],
            github: REPO_LINKS.es,
        },
        {
            title: '文档自动化生成器（r0_doc_watcher）',
            desc: '基于 Linux inode 监听与 Sphinx 生成流程，构建工程文档自动更新能力。',
            metric: '文档生成自动化流水线',
            labels: ['C++', 'Python', 'Linux inode', 'Sphinx'],
            github: REPO_LINKS.docWatcher,
        },
        {
            title: '自动化脚本簇',
            desc: '针对重复性网页流程构建自动化脚本，强调可维护性、稳定性与脚本化效率。',
            metric: '重复手工流程显著减少',
            labels: ['Python', 'Browser Automation', 'Workflow Script'],
            github: REPO_LINKS.scripts,
        },
        {
            title: '游可爱：全链路多端 KOL 激励平台后端',
            desc: '完成 KOL、内容、MCN、激励任务链路的后端架构与流程治理，支撑多角色协同。',
            metric: '全链路激励平台工程化交付',
            labels: ['后端平台', '流程引擎', '权限模型', '任务编排'],
            github: REPO_LINKS.profile,
        },
    ],
    wins: [
        {id: 'ccpc-changchun', label: 'CCPC 长春站（2020）', medal: '铜牌', emoji: '🥉', color: '#cd7f32'},
        {id: 'ccpc-weihai', label: 'CCPC 威海站（2020）', medal: '铜牌', emoji: '🥉', color: '#b87333'},
        {id: 'icpc-shanghai', label: 'ICPC 上海站（2020）', medal: '铁牌', emoji: '⚙️', color: '#7f8c8d'},
        {id: 'icpc-jinan', label: 'ICPC 济南站（2020）', medal: '银牌', emoji: '🥈', color: '#c0c0c0'},
    ],
};

contentMap.ja = {
    ...contentMap.en,
    subtitle: 'アルゴリズム設計とシステム実装を軸とするフルスタックエンジニア。',
    profileFactsTop: ['凌瀚遠', AGE_TOKEN, 'OpenVision アルゴリズムリード'],
    profileFactsBottom: ['フルスタックエンジニア', 'アルゴリズム駆動', '写真家', '書家（嶺南画派）'],
    summaryRibbon: [
        {id: 'ov', title: 'OpenVision · Algorithm Lead', detail: 'グローバルゲーム向けのアルゴ/データ基盤を設計。', stack: 'Recommendation · Risk Modeling · Backend'},
        {id: 'tx', title: 'Tencent IEG · Backend & AIGC Initiative Lead', detail: '推薦・審査・インセンティブ基盤のBackendを主導し、AIGC施策も牽引。', stack: 'Backend Systems · Recommendation Business · AIGC Initiative'},
        {id: 'fullstack', title: 'Full-stack Systems Engineering', detail: 'Frontend/Backend/Middlewareを横断し、リアルタイム系と可観測性を含むE2Eシステムを実装。', stack: 'アーキ設計 · 多層キャッシュ · 可観測性'},
        {id: 'aigc', title: 'LLM / AIGC Engineering', detail: 'LLM/RAGとマルチモーダル処理を実運用化し、Agent workflowとContext engineeringを実装。', stack: 'RAG · Agent Loop · Context Engineering'},
    ],
    sectionTitles: {stack: 'フルスタックマトリクス', milestones: 'マイルストーン', projects: '主要プロジェクト'},
    scenes: [{id: 'boot', points: ['Tencent IEG (2022-2025)', 'OpenVision Algorithm Lead (2025-now)']}],
    introExperiences: [
        {id: 'ov', company: 'OpenVision', iconKey: 'openvision', iconFallback: '🦄', role: 'Algorithm Lead · Global Site & Fantasy Studio', period: '2025.08-現在', tags: ['アルゴ/データ基盤統括', '方向性設計とチーム構築', 'ゲーム数値アルゴ設計', 'タグガバナンスと資産化', 'ユーザー分群推薦', 'リスク/ペース制御', '統合データ/アルゴパイプライン', '抽選/ランキングBackend']},
        {id: 'tx', company: 'Tencent Technology (Shenzhen) Co., Ltd.', iconKey: 'tencent', iconFallback: '🏢', role: 'Backend Engineer · IEG Interactive Entertainment Group', period: '2022.07-2025.08', tags: ['独立アルゴ案件開発', 'KOL推薦/Feed流推薦', 'コンテンツ審査/リスク判定', 'AIGC基盤探索コア', 'LLM/RAG/マルチモーダル実装', 'KOLインセンティブ基盤', 'Text2SQL微調整/分析自動化', '遅延キュー/基盤開発']},
        {id: 'msra', company: 'Microsoft Research Asia (MSRA)', iconKey: 'msra', iconFallback: '🔬', role: 'Algorithm Researcher · Machine Learning Group · Project-based', period: '2021.12-2022.06', tags: ['カーボンニュートラル政策シミュレーション', 'RL意思決定エージェント', 'MDP状態/行動設計', '遅延報酬向けReward Shaping', 'DQN/PPO比較検証', '因果推論と説明可能性']},
        {id: 'deeproute', company: 'DeepRoute.ai', iconKey: 'deeproute', iconFallback: '🚗', role: 'Software Engineer Intern · Cloud / Path Planning', period: '2021.06-2021.12', tags: ['行動計画 + 経路計画', '左折/交差点/環状交差点ルール', '状態機械 + ルールエンジン', 'HD Map + センサ融合', 'A* / サンプリング最適化', '軌道最適化とロバスト性改善']},
    ],
    introAchievements: [
        {id: 'ovreco', project: 'Global Recommendation: Rhythm-aware Constrained Revenue Optimization', outcome: 'リスクを制御しつつ、継続率と課金転換を改善。', note: '2025.09-現在 · Segmentation + Sequence Modeling + Multi-objective Ranking', labels: ['User Segmentation', 'Behavior Sequence Modeling', 'State Priority', 'Multi-objective Ranking', 'Risk-aware Recommendation', 'Lifecycle Constraints']},
        {id: 'reco', project: 'KOL Smart Selection: Multi-recall + Social Collaborative Recommendation', outcome: 'Recall hit rate >=85%、Feed CTR +23%、joint recommendation >30% coverage。', note: '2024.06-2025.07 · Multi-link Recall + Circle Dispatch + Social Graph', labels: ['Six-path Recall', 'Dual-tower', 'Center-greedy migration', 'Feed Recommendation', 'Social Graph Collaboration', '20+ Game Teams']},
        {id: 'bilm', project: 'BILM High-performance Relation Index & Persistence (Go)', outcome: 'largeID 30M / smallID 500 規模で検証。性能・信頼性・コストを両立。', note: '2025.11-2026.02 · RoaringBitmap + Snapshot/Delta/WAL', labels: ['RoaringBitmap', 'WAL', 'Snapshot + Delta', 'CRC Validation', 'Incremental Snapshot', 'Relation Algebra']},
        {id: 'aipipe', project: 'Automated Data Analysis Pipeline', outcome: '推論コスト -60%+、Recall +10.7%、初級分析工数を 70% 以上代替。', note: '2023.03-2024.07 · LATM ToolMaker/ToolUser + Private Sandbox', labels: ['LLM', 'ToolMaker/ToolUser', 'LATM', 'Prompt Engineering', 'Private Sandbox', 'Data Security']},
        {id: 'xingtong', project: 'Xingtong text2motion Motion Generation System', outcome: '日中英テキスト駆動の動作生成で成功率 >=80%、3回のライブ3Dで0 bug。', note: '2023.02-2024.07 · LLM/RAG + CLIP/MotionCLIP + Fantasia3D', labels: ['Instruction Parsing', 'Motion Retrieval', 'Pose Refinement', 'SAM + DINO', 'DragGAN/Fantasia3D', 'Multilingual Generation']},
        {id: 'carbon', project: 'Carbon-neutral Policy Simulation via Reinforcement Learning', outcome: '最適方策で排出 -18%、社会コスト -12%、方策変動 -21%。', note: '2022.02-2022.06 · DQN/PPO + Reward Shaping + Causal Inference', labels: ['Reinforcement Learning', 'Policy Optimization', 'MDP', 'Reward Shaping', 'Causal Graph', 'do-calculus']},
        {id: 'iotml', project: 'Machine-learning IoT Control System', outcome: '有効特徴次元 -13%、再現率 +10%、ソフト著作権取得。', note: '2019.06-2021.03 · Transformer + Multi-feature Fusion + Arduino/ROS', labels: ['Transformer Time-series', 'Multi-feature Fusion', 'Arduino/ROS', 'i2c/ZigBee', 'Auto Alerting', 'Copyright']},
        {id: 'planner', project: 'Autonomous Driving Behavior & Path Planning Module', outcome: '左折・交差点協調・環状交差点・車線変更制約のルールと候補軌道生成を実装。', note: '2021.06-2021.12 · Rule Engine + State Machine + Trajectory Optimization', labels: ['Behavior Logic', 'Rule Engine', 'HD Map + Perception', 'A* & Sampling', 'Trajectory Optimization', 'Robustness']},
    ],
    capabilityTracks: [
        {
            id: 'reco',
            name: 'Recommendation & Strategy Modeling',
            value: 94,
            summary: 'ユーザー状態分群、MLランキング、制約付き収益最適化を統合。',
            details: ['Rule分群 + K-Means/GMM信頼度キャリブレーション', 'Learning-to-rank: Wide&Deep, FM/DeepFM, CTR/CVR, sequence features', '6系統recall + social graph協調推薦', '収益・新規性・没入度・リスク露出を同時に制約付き最適化'],
        },
        {
            id: 'llm',
            name: 'LLM / AIGC System Engineering',
            value: 92,
            summary: 'Prompt設計・効率的注意機構・マルチモーダル運用まで一貫対応。',
            details: ['LLM + RAG + CLIP/MotionCLIP pipelines', 'Linear-Multihead-Attention（Linformer）再現による線形複雑度Attention実装', '内環Agent設計：plan-execute-reviewの反復制御', 'コンテキストエンジニアリング：記憶圧縮・retrieval routing・token budget制御', 'Private sandbox + desensitization + policy guardrails'],
        },
        {
            id: 'fullstack',
            name: 'Full-stack Product Engineering',
            value: 95,
            summary: 'フロント、バックエンド、ミドルウェア、クラウド運用、実時間配信基盤を統合。',
            details: ['C++起点のエンジニアリング基盤：性能/メモリ意識と異言語サービス連携', 'マイクロサービス分割、境界設計、サービスガバナンス', '多層キャッシュ設計（local + Redis + DB）と整合/劣化運用', '設計パターン中心の実装（strategy/factory/pipeline/state machine）', '実時間ストリーミング設計：WebSocket伝送、非同期イベント連鎖、バックプレッシャ制御、アラート編成', 'E2E開発力：連携実装、可観測性、CI/CD、信頼性運用'],
        },
        {
            id: 'algoData',
            name: 'Algorithm & Data Intelligence',
            value: 91,
            summary: 'ACM基礎、ML/RL、視覚リスク判定、データガバナンスを一体設計。',
            details: ['基礎アルゴ: DP、グラフ探索、貪欲、計算量最適化', '知能アルゴ: RL（DQN/PPO/MDP）、因果推論、Bayesian最適化', '視覚意思決定パイプライン設計：幾何整列、多対象追跡ライフサイクル、ルール駆動リスク判定', 'データガバナンス: 指標標準、品質ルール、血縁追跡、メタデータ/権限管理', 'データ全ライフサイクル: 収集-建模-提供-監視-改善の閉ループ'],
        },
    ],
    resumeDomains: [
        {
            id: 'fullstack',
            title: 'Full-stack Delivery',
            points: ['Frontend + backend + infra coordination', 'Requirement-to-release ownership', 'Complex role/process system delivery'],
            github: REPO_LINKS.websiteScreen,
        },
        {
            id: 'algorithm',
            title: 'Algorithm Strategy',
            points: ['Recommendation + risk + segmentation integration', 'Long-term yield optimization with lifecycle constraints', 'Explainable and operable strategy design'],
            github: REPO_LINKS.profile,
        },
        {
            id: 'llm',
            title: 'LLM & Multimodal',
            points: ['LLM/RAG/AIGC workflow implementation', 'Prompt chain + tool orchestration + sandbox safety', 'Text/image/motion generation pipeline experience'],
            github: REPO_LINKS.profile,
        },
        {
            id: 'research',
            title: 'Research Foundation',
            points: ['RL policy simulation + causal inference', 'Explainability for cross-team decision alignment', 'Research methods translated into production rules'],
            github: REPO_LINKS.profile,
        },
        {
            id: 'engineeringAssets',
            title: 'Youkeai KOL Incentive Platform',
            points: ['Owned backend implementation of a multi-end, full-chain KOL incentive platform at Tencent IEG', 'Unified KOL/content/MCN/task workflows with role-based process control', 'Delivered task/content lifecycle management with permission governance'],
            github: REPO_LINKS.profile,
        },
    ],
    projectHighlights: [
        {
            title: 'Global Recommendation: Constrained Revenue Optimization',
            desc: 'Segmentation + behavior sequence + risk constraints for retention/conversion growth.',
            metric: 'Long-term revenue optimization',
            labels: ['Segmentation', 'State Priority', 'Multi-objective Ranking'],
            github: REPO_LINKS.profile,
        },
        {
            title: 'BILM High-performance Relation Index (Go)',
            desc: 'RoaringBitmap primary index + WAL/Snapshot/Delta persistence for 30M-scale serving.',
            metric: 'Validated at 30M largeID',
            labels: ['RoaringBitmap', 'WAL/CRC', 'Incremental Snapshot'],
            github: REPO_LINKS.profile,
        },
        {
            title: 'Automated Data Analysis Pipeline (LLM)',
            desc: 'ToolMaker/ToolUser + sandbox for extraction/visualization/insight automation.',
            metric: 'Inference -60%+ / Recall +10.7%',
            labels: ['LATM', 'Prompt Engineering', 'Data Security'],
            github: REPO_LINKS.profile,
        },
        {
            title: 'swimAD: Multi-view Drowning Alert System',
            desc: 'Python real-time stack integrating YOLO detection, 4-view homography association, OCSORT lifecycle tracking, and event-ID alert delivery.',
            metric: '4-view fusion + 9-rule risk detection + event pipeline',
            labels: ['Tornado/WebSocket', 'YOLO + BoxMOT/OCSORT', 'Rule Engine', 'Event Logging'],
            github: REPO_LINKS.swimAD,
        },
        {
            title: 'Linear-Multihead-Attention (Linformer Reproduction)',
            desc: 'Reproduced Linformer linear multi-head attention and validated implementation details for efficient Transformer attention.',
            metric: 'Linear-complexity attention reproduction',
            labels: ['PyTorch', 'Transformer', 'Linformer', 'Linear Attention'],
            github: REPO_LINKS.linearMultiheadAttention,
        },
        {
            title: 'Personal Website Twin-Repo Architecture',
            desc: 'r0website_screen + r0website_server compose an end-to-end personal product stack.',
            metric: 'Continuous personal product iteration',
            labels: ['React/MobX', 'Go', 'MongoDB', 'CRACO'],
            github: REPO_LINKS.websiteScreen,
        },
        {
            title: 'Data Middleware Toolkit Suite',
            desc: 'r0redis, r0mongo, r0_es: helper toolchains for Redis/Mongo/Elasticsearch workflows.',
            metric: 'Unified middleware helper capabilities',
            labels: ['Redis', 'MongoDB', 'Elasticsearch', 'Python'],
            github: REPO_LINKS.es,
        },
        {
            title: 'Docs Auto Generator (r0_doc_watcher)',
            desc: 'Linux inode watch + Sphinx generation flow for maintainable engineering docs.',
            metric: 'Automated documentation pipeline',
            labels: ['C++', 'Python', 'Linux inode', 'Sphinx'],
            github: REPO_LINKS.docWatcher,
        },
        {
            title: 'Automation Script Cluster',
            desc: 'Script-driven automation for repetitive web workflows, focusing on stability and maintainability.',
            metric: 'Reduced manual repetitive workload',
            labels: ['Python', 'Browser Automation', 'Workflow Script'],
            github: REPO_LINKS.scripts,
        },
        {
            title: 'Youkeai: Multi-end KOL Incentive Platform Backend',
            desc: 'Built backend workflows for KOL/content/MCN/incentive tasks with role permissions and process governance.',
            metric: 'End-to-end incentive platform delivery',
            labels: ['Backend Platform', 'Workflow Engine', 'Permission Model', 'Task Orchestration'],
            github: REPO_LINKS.profile,
        },
    ],
    wins: [
        {id: 'ccpc-changchun', label: 'CCPC Changchun Regional (2020)', medal: 'Bronze', emoji: '🥉', color: '#cd7f32'},
        {id: 'ccpc-weihai', label: 'CCPC Weihai Regional (2020)', medal: 'Bronze', emoji: '🥉', color: '#b87333'},
        {id: 'icpc-shanghai', label: 'ICPC Asia Shanghai Regional (2020)', medal: 'Iron', emoji: '⚙️', color: '#7f8c8d'},
        {id: 'icpc-jinan', label: 'ICPC Asia Jinan Regional (2020)', medal: 'Silver', emoji: '🥈', color: '#c0c0c0'},
    ],
};

const USHOULDKNOW_LANG_PATH_MAP = Object.freeze({
    en: '/ushouldknow/en',
    zh: '/ushouldknow/zh',
    ja: '/ushouldknow/ja',
});

const langTabs = [
    {key: 'en', label: 'EN', path: '/ushouldknow/en'},
    {key: 'zh', label: '中文', path: '/ushouldknow/zh'},
    {key: 'ja', label: '日本語', path: '/ushouldknow/ja'},
];

const sectionMetaMap = {
    en: {awards: 'Awards', contacts: 'Contact', education: 'Education', stackPower: 'Stack Power', email: 'Email', blog: 'Blog', home: 'Home', location: 'Location', locationValue: 'Shenzhen / Remote', domain: 'Domain', project: 'Project'},
    zh: {awards: '奖项', contacts: '联系方式', education: '教育', stackPower: '技术栈强度', email: '邮箱', blog: '博客', home: '主页', location: 'Base', locationValue: '深圳 / Remote', domain: '能力域', project: '项目'},
    ja: {awards: '受賞', contacts: '連絡先', education: '学歴', stackPower: 'スタック強度', email: 'Email', blog: 'Blog', home: 'Home', location: 'Location', locationValue: 'Shenzhen / Remote', domain: 'Domain', project: 'Project'},
};

const capabilityTrackRenderOrder = Object.freeze(['algoData', 'fullstack', 'llm', 'reco']);
const capabilityTrackOrderIndex = Object.freeze(capabilityTrackRenderOrder.reduce((acc, id, idx) => {
    acc[id] = idx;
    return acc;
}, {}));

const educationMap = {
    en: [{
        period: '2018.09-2022.07',
        degree: 'B.E., Computer Science (Excellent Engineer Track)',
        school: 'Fujian Normal University',
        honors: ['National Scholarship (2018-2021)', 'University Second-class Scholarship (2018-2021)', 'Outstanding Graduate (2022)'],
    }],
    zh: [{
        period: '2018.09-2022.07',
        degree: '计算机科学与技术-卓越工程师方向，工学学士',
        school: '福建师范大学',
        honors: ['国家奖学金（2018-2021）', '校二等奖学金（2018-2021）', '优秀毕业生（2022）'],
    }],
    ja: [{
        period: '2018.09-2022.07',
        degree: '情報工学 学士（卓越エンジニア育成コース）',
        school: '福建師範大学',
        honors: ['国家奨学金（2018-2021）', '学内二等奨学金（2018-2021）', '優秀卒業生（2022）'],
    }],
};

const contactProfile = Object.freeze({
    phoneCN: '+86 18520664652',
    phoneJP: '+81 080 15426051',
    email: 'ushouldknowr0@gmail.com',
    wechat: 'RRyou0',
    website: 'https://www.Shyr0.com',
    instagram: 'https://www.instagram.com/r0.o33',
    github: 'https://github.com/boogieLing',
});

function normalizeLang(lang) {
    if (!lang) {
        return 'en';
    }
    const v = String(lang).toLowerCase();
    if (v === 'zh' || v === 'cn' || v === 'zh-cn') {
        return 'zh';
    }
    if (v === 'ja' || v === 'jp' || v === 'ja-jp') {
        return 'ja';
    }
    return 'en';
}

function guessLangFromBrowser() {
    if (typeof window === 'undefined') {
        return 'en';
    }
    const browserLangs = [navigator.language, ...(navigator.languages || [])].map((item) => String(item || '').toLowerCase()).filter(Boolean);
    if (browserLangs.some((item) => item.startsWith('ja') || item.includes('jp'))) {
        return 'ja';
    }
    if (browserLangs.some((item) => item.startsWith('zh') || item.includes('cn'))) {
        return 'zh';
    }
    const timezone = String(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    if (timezone.startsWith('Asia/Tokyo')) {
        return 'ja';
    }
    if (timezone.startsWith('Asia/Shanghai') || timezone.startsWith('Asia/Chongqing') || timezone.startsWith('Asia/Hong_Kong') || timezone.startsWith('Asia/Taipei')) {
        return 'zh';
    }
    return 'en';
}

function guessLangFromCountryCode(countryCode) {
    const code = String(countryCode || '').toUpperCase();
    if (!code) {
        return '';
    }
    if (code === 'JP') {
        return 'ja';
    }
    if (code === 'CN' || code === 'HK' || code === 'MO' || code === 'TW') {
        return 'zh';
    }
    return 'en';
}

async function detectPreferredLangForEntry() {
    const browserFallback = guessLangFromBrowser();
    if (typeof window === 'undefined') {
        return browserFallback;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1400);
    try {
        const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
        });
        if (!response.ok) {
            return browserFallback;
        }
        const data = await response.json();
        const ipLang = guessLangFromCountryCode(data?.country_code || data?.country);
        return ipLang || browserFallback;
    } catch (error) {
        return browserFallback;
    } finally {
        window.clearTimeout(timeout);
    }
}

const UShouldKnow = () => {
    const navigate = useNavigate();
    const {lang} = useParams();
    const currentLang = normalizeLang(lang);
    const [displayCustomCursor] = useState(false);
    const [ageClock, setAgeClock] = useState(Date.now());
    const [scrollProgress, setScrollProgress] = useState(0);
    const [backgroundSeed] = useState(() => ({
        startGroup: Math.floor(Math.random() * backgroundScrollPaletteGroups.length),
        direction: Math.random() > 0.5 ? 1 : -1,
        slotReverse: Math.random() > 0.5,
        directionTemplate: backgroundDirectionTemplates[Math.floor(Math.random() * backgroundDirectionTemplates.length)],
        layoutSeed: Math.random(),
    }));
    const [particles, setParticles] = useState(() => buildSymbolParticles(getSymbolParticleCount()));
    useEffect(() => {
        if (lang) {
            return undefined;
        }
        let canceled = false;
        (async () => {
            const detectedLang = await detectPreferredLangForEntry();
            if (canceled) {
                return;
            }
            const targetPath = USHOULDKNOW_LANG_PATH_MAP[detectedLang] || USHOULDKNOW_LANG_PATH_MAP.en;
            navigate(targetPath, {replace: true});
        })();
        return () => {
            canceled = true;
        };
    }, [lang, navigate]);

    const c = useMemo(() => {
        const base = contentMap[currentLang] || contentMap.en;
        return {
            ...base,
            introExperiences: base.introExperiences.map((item) => ({
                ...item,
                ...getExperienceVisual(item.id),
                links: getExperienceLinks(item.id),
                companyHomepage: item.companyHomepage || getExperienceCompanyHomepage(item.id),
            })),
        };
    }, [currentLang]);
    const orderedCapabilityTracks = useMemo(() => {
        const list = Array.isArray(c.capabilityTracks) ? [...c.capabilityTracks] : [];
        return list.sort((a, b) => {
            const orderA = capabilityTrackOrderIndex[a.id] ?? Number.MAX_SAFE_INTEGER;
            const orderB = capabilityTrackOrderIndex[b.id] ?? Number.MAX_SAFE_INTEGER;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            return String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hans-CN');
        });
    }, [c.capabilityTracks]);

    const liveAge = useMemo(() => {
        const years = Math.max(0, (ageClock - BIRTHDAY_TS) / MS_PER_YEAR);
        return years.toFixed(8);
    }, [ageClock]);

    const localizedAgeFact = useMemo(() => {
        if (currentLang === 'zh') {
            return `${liveAge} 岁`;
        }
        if (currentLang === 'ja') {
            return `2000年生 · ${liveAge}歳`;
        }
        return liveAge;
    }, [currentLang, liveAge]);

    const profileFactsTop = useMemo(() => {
        const fallback = Array.isArray(c.profileFacts) ? [c.profileFacts[0], AGE_TOKEN, c.profileFacts[4]] : [];
        const source = Array.isArray(c.profileFactsTop) && c.profileFactsTop.length ? c.profileFactsTop : fallback;
        return source.map((item) => (item === AGE_TOKEN ? localizedAgeFact : item)).filter(Boolean);
    }, [c.profileFactsTop, c.profileFacts, localizedAgeFact]);
    const profileFactsBottom = useMemo(() => {
        const fallback = Array.isArray(c.profileFacts) ? [c.profileFacts[1], c.profileFacts[2]] : [];
        const source = Array.isArray(c.profileFactsBottom) && c.profileFactsBottom.length ? c.profileFactsBottom : fallback;
        return source.filter(Boolean);
    }, [c.profileFactsBottom, c.profileFacts]);
    const primaryNameFact = useMemo(() => {
        const fallbackName = currentLang === 'ja' ? '凌瀚遠' : '凌瀚远';
        const sourceName = Array.isArray(profileFactsTop) && profileFactsTop.length ? profileFactsTop[0] : '';
        return sourceName || fallbackName;
    }, [currentLang, profileFactsTop]);
    const localizedPhone = useMemo(() => (currentLang === 'zh' ? contactProfile.phoneCN : contactProfile.phoneJP), [currentLang]);
    const profileFactsTopTail = useMemo(() => {
        if (!Array.isArray(profileFactsTop) || profileFactsTop.length <= 1) {
            return [];
        }
        return profileFactsTop.slice(1);
    }, [profileFactsTop]);

    const heroFrameItems = useMemo(() => buildHeroAsciiFrames(), []);
    const heroFrames = useMemo(() => heroFrameItems.map((item) => item.frame), [heroFrameItems]);
    const heroFrameWeightedPool = useMemo(() => {
        return heroFrameItems.flatMap((item) => {
            const size = Math.max(1, Number(item.weight) || 1);
            return Array.from({length: size}).map(() => item.frame);
        });
    }, [heroFrameItems]);
    const [heroAscii, setHeroAscii] = useState(heroFrames[0]);
    const [activeRelationIds, setActiveRelationIds] = useState([]);
    const [pinnedRelationIds, setPinnedRelationIds] = useState([]);
    const [iconLoadErrorMap, setIconLoadErrorMap] = useState({});
    const [activeTrackId, setActiveTrackId] = useState('');
    const [activeMetricId, setActiveMetricId] = useState('');
    const [metricCardBgMap, setMetricCardBgMap] = useState({});
    const [hoveredStackGroup, setHoveredStackGroup] = useState('');
    const [isTrackDetailHover, setIsTrackDetailHover] = useState(false);
    const [showHeroNameTip, setShowHeroNameTip] = useState(false);
    const [isCompactViewport, setIsCompactViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 900 : false));
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1366));
    const particleWalkRafRef = useRef(0);
    const particleScrollTopRef = useRef(0);
    const relationBoardRef = useRef(null);
    const summaryFusionRef = useRef(null);
    const summaryCardRefs = useRef([]);
    const heroAsciiRef = useRef(heroFrames[0]);
    const heroMorphTimerRef = useRef(0);
    const heroSwitchTimerRef = useRef(0);
    const heroMorphingRef = useRef(false);
    const experienceRefs = useRef({});
    const achievementRefs = useRef({});
    const [relationLines, setRelationLines] = useState([]);

    useEffect(() => {
        const defaultRelationIds = c.introExperiences[0]?.links || [];
        setPinnedRelationIds(defaultRelationIds);
        setActiveRelationIds(defaultRelationIds);
        setIconLoadErrorMap({});
        setActiveTrackId(orderedCapabilityTracks[0]?.id || '');
        setActiveMetricId(c.summaryRibbon[0]?.id || '');
        setMetricCardBgMap(() => {
            const next = {};
            c.summaryRibbon.forEach((item) => {
                next[item.id] = pickRandomMetricBg();
            });
            return next;
        });
    }, [currentLang, c.introExperiences, orderedCapabilityTracks, c.summaryRibbon]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const animateTo = (targetFrame) => {
            if (!targetFrame || targetFrame === heroAsciiRef.current) {
                return;
            }
            if (heroMorphTimerRef.current) {
                window.clearInterval(heroMorphTimerRef.current);
                heroMorphTimerRef.current = 0;
            }
            if (prefersReducedMotion) {
                heroAsciiRef.current = targetFrame;
                setHeroAscii(targetFrame);
                return;
            }
            const source = heroAsciiRef.current;
            const sourceChars = source.split('');
            const targetChars = targetFrame.split('');
            const totalSteps = 16;
            let step = 0;
            heroMorphingRef.current = true;
            heroMorphTimerRef.current = window.setInterval(() => {
                step += 1;
                const progress = step / totalSteps;
                const next = sourceChars.map((ch, idx) => {
                    const targetCh = targetChars[idx] || ' ';
                    if (targetCh === '\n') {
                        return '\n';
                    }
                    if (targetCh === ' ') {
                        if (ch === ' ') {
                            return ' ';
                        }
                        return progress >= 0.32 ? ' ' : ch;
                    }
                    if (ch === ' ') {
                        return progress >= 0.55 ? targetCh : ' ';
                    }
                    if (ch === targetCh) {
                        return ch;
                    }
                    if (Math.random() < progress) {
                        return targetCh;
                    }
                    return MORPH_CHARS[(idx + step) % MORPH_CHARS.length];
                }).join('');
                setHeroAscii(next);
                if (step >= totalSteps) {
                    window.clearInterval(heroMorphTimerRef.current);
                    heroMorphTimerRef.current = 0;
                    heroAsciiRef.current = targetFrame;
                    heroMorphingRef.current = false;
                    setHeroAscii(targetFrame);
                }
            }, 48);
        };

        heroSwitchTimerRef.current = window.setInterval(() => {
            if (!heroFrames.length || heroMorphingRef.current) {
                return;
            }
            const pool = heroFrameWeightedPool.length ? heroFrameWeightedPool : heroFrames;
            const nextFrame = pool[Math.floor(Math.random() * pool.length)];
            animateTo(nextFrame);
        }, prefersReducedMotion ? 5200 : 3600);

        return () => {
            if (heroMorphTimerRef.current) {
                window.clearInterval(heroMorphTimerRef.current);
                heroMorphTimerRef.current = 0;
            }
            if (heroSwitchTimerRef.current) {
                window.clearInterval(heroSwitchTimerRef.current);
                heroSwitchTimerRef.current = 0;
            }
            heroMorphingRef.current = false;
        };
    }, [heroFrames, heroFrameWeightedPool]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setAgeClock(Date.now());
        }, 120);
        return () => {
            window.clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const updateViewportMode = () => {
            const width = window.innerWidth;
            setIsCompactViewport(width <= 900);
            setViewportWidth(width);
            const nextCount = getSymbolParticleCount();
            setParticles((prev) => (prev.length === nextCount ? prev : buildSymbolParticles(nextCount)));
        };
        updateViewportMode();
        window.addEventListener('resize', updateViewportMode, {passive: true});
        return () => {
            window.removeEventListener('resize', updateViewportMode);
        };
    }, []);

    useEffect(() => {
        const root = document.getElementById('ushouldknow-scroll-root');
        if (!root) {
            return undefined;
        }
        particleScrollTopRef.current = root.scrollTop;
        const onScroll = () => {
            const max = Math.max(1, root.scrollHeight - root.clientHeight);
            const currentTop = root.scrollTop;
            const ratio = Math.min(1, Math.max(0, currentTop / max));
            setScrollProgress(Number((ratio * 100).toFixed(2)));
            const delta = currentTop - particleScrollTopRef.current;
            particleScrollTopRef.current = currentTop;
            if (Math.abs(delta) < 0.2) {
                return;
            }
            if (particleWalkRafRef.current) {
                window.cancelAnimationFrame(particleWalkRafRef.current);
            }
            particleWalkRafRef.current = window.requestAnimationFrame(() => {
                const walkEnergy = Math.min(3.8, 0.72 + (Math.abs(delta) / 130));
                setParticles((prev) => prev.map((particle) => {
                    const homeX = Number.isFinite(particle.homeX) ? particle.homeX : particle.x;
                    const homeY = Number.isFinite(particle.homeY) ? particle.homeY : particle.y;
                    const jitterX = (Math.random() - 0.5) * walkEnergy * 2.2;
                    const jitterY = (Math.random() - 0.5) * walkEnergy * 2.2;
                    const anchorPullX = (homeX - particle.x) * 0.09;
                    const anchorPullY = (homeY - particle.y) * 0.09;
                    let nextX = particle.x + jitterX + anchorPullX;
                    let nextY = particle.y + jitterY + anchorPullY;
                    if (nextX < 1.2) {
                        nextX = 1.2 + ((1.2 - nextX) * 0.42);
                    } else if (nextX > 98.8) {
                        nextX = 98.8 - ((nextX - 98.8) * 0.42);
                    }
                    if (nextY < 1.2) {
                        nextY = 1.2 + ((1.2 - nextY) * 0.42);
                    } else if (nextY > 98.8) {
                        nextY = 98.8 - ((nextY - 98.8) * 0.42);
                    }
                    return {
                        ...particle,
                        homeX,
                        homeY,
                        text: Math.random() < 0.04 ? pickRandomSymbol() : particle.text,
                        x: Number(clampNumber(nextX, 1.2, 98.8).toFixed(3)),
                        y: Number(clampNumber(nextY, 1.2, 98.8).toFixed(3)),
                    };
                }));
                particleWalkRafRef.current = 0;
            });
        };
        onScroll();
        root.addEventListener('scroll', onScroll, {passive: true});
        return () => {
            root.removeEventListener('scroll', onScroll);
            if (particleWalkRafRef.current) {
                window.cancelAnimationFrame(particleWalkRafRef.current);
                particleWalkRafRef.current = 0;
            }
        };
    }, []);

    useLayoutEffect(() => {
        const board = relationBoardRef.current;
        if (!board) {
            return undefined;
        }
        const computeLines = () => {
            const boardRect = board.getBoundingClientRect();
            const lines = [];
            c.introExperiences.forEach((experience) => {
                const expNode = experienceRefs.current[experience.id];
                if (!expNode) {
                    return;
                }
                const expRect = expNode.getBoundingClientRect();
                const fromX = expRect.right - boardRect.left + 2;
                const fromY = expRect.top - boardRect.top + expRect.height / 2;
                experience.links.forEach((achId, relationIndex) => {
                    const achNode = achievementRefs.current[achId];
                    if (!achNode) {
                        return;
                    }
                    const achRect = achNode.getBoundingClientRect();
                    const toX = achRect.left - boardRect.left - 2;
                    const toY = achRect.top - boardRect.top + achRect.height / 2;
                    const palette = getRelationLinePalette(experience.id, relationIndex);
                    lines.push({
                        key: `${experience.id}-${achId}`,
                        relationId: achId,
                        gradientId: `relation-gradient-${experience.id}-${achId}`,
                        gradientStart: palette.start,
                        gradientEnd: palette.end,
                        glow: palette.glow,
                        d: `M ${fromX} ${fromY} C ${(fromX + toX) / 2} ${fromY}, ${(fromX + toX) / 2} ${toY}, ${toX} ${toY}`,
                    });
                });
            });
            setRelationLines(lines);
        };
        computeLines();
        const resizeObserver = new ResizeObserver(() => computeLines());
        resizeObserver.observe(board);
        window.addEventListener('resize', computeLines);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', computeLines);
        };
    }, [c.introExperiences, c.introAchievements, currentLang]);

    const progress = Math.max(0, Math.min(100, scrollProgress));
    const progressRatio = Math.max(0.01, progress / 100);
    const scrollBackgroundColors = useMemo(() => pickScrollPaletteColors(progress / 100, backgroundSeed), [progress, backgroundSeed]);
    const backgroundGlowLayout = useMemo(() => buildBackgroundGlowLayout(viewportWidth, backgroundSeed), [viewportWidth, backgroundSeed]);
    const pageBackgroundStyle = useMemo(() => {
        const glowPalette = buildBackgroundGlowPalette(scrollBackgroundColors, backgroundGlowLayout.length, backgroundSeed);
        const radialLayers = backgroundGlowLayout.map((glow, idx) => {
            const color = glowPalette[idx % glowPalette.length] || glowPalette[0] || scrollBackgroundColors[0];
            return `radial-gradient(${glow.width}px ${glow.height}px at ${glow.x}% ${glow.y}%, ${hexToRgba(color, glow.alpha)} 0%, transparent ${glow.stop}%)`;
        }).join(', ');
        return {
            '--bg-glow-1': scrollBackgroundColors[0],
            '--bg-glow-2': scrollBackgroundColors[1],
            '--bg-glow-3': scrollBackgroundColors[2],
            '--bg-glow-1-soft': hexToRgba(scrollBackgroundColors[0], 0.76),
            '--bg-glow-2-soft': hexToRgba(scrollBackgroundColors[1], 0.72),
            '--bg-glow-3-soft': hexToRgba(scrollBackgroundColors[2], 0.72),
            '--timeline-accent': scrollBackgroundColors[0],
            '--timeline-accent-strong': hexToRgba(scrollBackgroundColors[0], 0.92),
            '--timeline-accent-mid': hexToRgba(scrollBackgroundColors[0], 0.56),
            '--timeline-accent-soft': hexToRgba(scrollBackgroundColors[0], 0.28),
            '--timeline-accent-faint': hexToRgba(scrollBackgroundColors[0], 0.16),
            '--bg-radials': radialLayers,
            '--bg-pos-1': backgroundSeed.directionTemplate.p1,
            '--bg-pos-2': backgroundSeed.directionTemplate.p2,
            '--bg-pos-3': backgroundSeed.directionTemplate.p3,
            '--bg-base': '#07090f',
        };
    }, [backgroundSeed, backgroundGlowLayout, scrollBackgroundColors]);
    const sectionMeta = sectionMetaMap[currentLang] || sectionMetaMap.en;
    const careerTimeline = useMemo(() => {
        const source = Array.isArray(c.introExperiences) ? [...c.introExperiences] : [];
        const normalized = source.map((item) => ({item, range: parsePeriodRange(item.period)})).filter((item) => item.range);
        const sorted = normalized.sort((a, b) => {
            if (b.range.endMonthIndex !== a.range.endMonthIndex) {
                return b.range.endMonthIndex - a.range.endMonthIndex;
            }
            return b.range.startMonthIndex - a.range.startMonthIndex;
        });
        let pointCursor = 0;
        return sorted.map(({item, range}, idx) => {
            const nextRange = sorted[idx + 1]?.range;
            const startBoundaryDelta = nextRange ? (range.startMonthIndex - nextRange.endMonthIndex) : 0;
            const hasGapConnector = startBoundaryDelta > 0;
            const gapMonths = hasGapConnector ? startBoundaryDelta : 0;
            const {roleTitle, roleDepartment} = parseRoleAndDepartment(item.role);
            const durationWeight = Number(clampNumber(1.45 + (Math.log1p(range.durationMonths) * 1.18), 1.6, 4.4).toFixed(3));
            const connectorWeight = hasGapConnector ? Number(clampNumber(0.68 + (Math.log1p(gapMonths) * 0.56), 0.76, 2.2).toFixed(3)) : 0.46;
            const compactThreshold = 62;
            const compactSize = `${item.company}${roleTitle}${roleDepartment}`.length > compactThreshold;
            const hasRightPoint = hasGapConnector || idx === sorted.length - 1;
            const timelineLeftTimeTop = (pointCursor % 2) === 0;
            pointCursor += 1;
            let timelineRightTimeTop = timelineLeftTimeTop;
            if (hasRightPoint) {
                timelineRightTimeTop = (pointCursor % 2) === 0;
                pointCursor += 1;
            }
            return {
                ...item,
                timelineStage: (sorted.length - idx) - 1,
                timelineSpan: durationWeight,
                timelineConnectorSpan: connectorWeight,
                timelineGapMonths: gapMonths,
                timelineHasGap: hasGapConnector,
                timelineHasRightPoint: hasRightPoint,
                timelineLeftTimeTop,
                timelineRightTimeTop,
                timelineRoleTitle: roleTitle || item.role,
                timelineRoleDepartment: roleDepartment,
                timelineCompact: compactSize,
                timelineLeftTime: formatMonthIndex(range.endMonthIndex),
                timelineRightTime: formatMonthIndex(range.startMonthIndex),
                isCurrentNode: range.isPresent,
            };
        });
    }, [c.introExperiences]);
    const educationRows = educationMap[currentLang] || educationMap.en;
    const activeTrack = useMemo(() => {
        if (!Array.isArray(orderedCapabilityTracks) || !orderedCapabilityTracks.length) {
            return null;
        }
        return orderedCapabilityTracks.find((track) => track.id === activeTrackId) || orderedCapabilityTracks[0];
    }, [orderedCapabilityTracks, activeTrackId]);
    const activeTrackDetails = useMemo(() => {
        if (!activeTrack) {
            return [];
        }
        const langExtra = trackExtraDetailMap[currentLang] || trackExtraDetailMap.en;
        const extra = langExtra[activeTrack.id] || [];
        return [...activeTrack.details, ...extra];
    }, [activeTrack, currentLang]);
    const activeStackWords = useMemo(() => {
        if (!activeTrack?.id) {
            return [];
        }
        const orderedTerms = trackStackTermMap[activeTrack.id] || [];
        const groupConfig = trackStackGroupMap[activeTrack.id] || {};
        const termGroupMap = new Map();
        Object.keys(groupConfig).forEach((groupKey) => {
            (groupConfig[groupKey] || []).forEach((term) => {
                termGroupMap.set(term, groupKey);
            });
        });
        const dict = new Map(stackWordCloud.map((item) => [item.name, item]));
        return orderedTerms.map((name) => {
            const item = dict.get(name);
            if (!item) {
                return null;
            }
            return {...item, groupKey: termGroupMap.get(name) || 'other'};
        }).filter(Boolean);
    }, [activeTrack]);
    const stackWordsByZone = useMemo(() => {
        const zones = {top: [], left: [], right: [], bottom: []};
        activeStackWords.forEach((item, index) => {
            const slot = index % 10;
            if (slot < 4) {
                zones.top.push(item);
            } else if (slot < 6) {
                zones.left.push(item);
            } else if (slot < 8) {
                zones.right.push(item);
            } else {
                zones.bottom.push(item);
            }
        });
        return zones;
    }, [activeStackWords]);
    const activeTrackAccent = activeTrack ? (trackAccentMap[activeTrack.id] || '#74b9ff') : '#74b9ff';
    const trackLayoutPreset = useMemo(() => {
        if (currentLang === 'en') {
            return {workspaceHeight: 560, detailHeight: 220};
        }
        return {workspaceHeight: 520, detailHeight: 196};
    }, [currentLang]);
    const achievementById = useMemo(() => {
        return new Map((c.introAchievements || []).map((item) => [item.id, item]));
    }, [c.introAchievements]);

    useEffect(() => {
        if (!Array.isArray(orderedCapabilityTracks) || orderedCapabilityTracks.length <= 1) {
            return undefined;
        }
        if (isTrackDetailHover) {
            return undefined;
        }
        const timer = window.setInterval(() => {
            setActiveTrackId((prev) => {
                const list = orderedCapabilityTracks;
                const currentIndex = list.findIndex((item) => item.id === prev);
                const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % list.length : 0;
                return list[nextIndex].id;
            });
        }, 8000);
        return () => {
            window.clearInterval(timer);
        };
    }, [orderedCapabilityTracks, isTrackDetailHover]);

    const relationAccentMap = useMemo(() => {
        const map = {};
        relationLines.forEach((line) => {
            if (!map[line.relationId]) {
                map[line.relationId] = {start: line.gradientStart, end: line.gradientEnd, glow: line.glow};
            }
        });
        return map;
    }, [relationLines]);

    const progressFaceTrail = useMemo(() => {
        const facePool = Array.isArray(c.progressFaces) && c.progressFaces.length ? c.progressFaces : ['^_^'];
        const count = Math.max(1, Math.ceil(progressRatio * facePool.length));
        return Array.from({length: count}).map((_, idx) => ({
            key: `progress-face-${idx}`,
            text: facePool[(idx + Math.floor(progressRatio * 10)) % facePool.length],
            delay: `${idx * -0.08}s`,
        }));
    }, [c.progressFaces, progressRatio]);
    const summaryCards = useMemo(() => {
        const domains = (c.resumeDomains || []).map((domain) => ({type: 'domain', key: `domain-${domain.id}`, payload: domain}));
        const projects = (c.projectHighlights || []).map((project, idx) => ({type: 'project', key: `project-${idx}-${project.title}`, payload: project}));
        return [...domains, ...projects];
    }, [c.resumeDomains, c.projectHighlights]);

    useLayoutEffect(() => {
        const root = summaryFusionRef.current;
        if (!root) {
            return undefined;
        }
        const paintMasonry = () => {
            const rootStyle = window.getComputedStyle(root);
            const rowUnit = Number.parseFloat(rootStyle.gridAutoRows) || 2;
            const gap = Number.parseFloat(rootStyle.rowGap) || 8;
            summaryCardRefs.current.forEach((node) => {
                if (!node) {
                    return;
                }
                const height = node.getBoundingClientRect().height;
                const span = Math.max(1, Math.ceil((height + gap) / (rowUnit + gap)));
                node.style.setProperty('--masonry-span', String(span));
            });
        };
        const rafPaint = () => window.requestAnimationFrame(paintMasonry);
        rafPaint();
        const timer = window.setTimeout(rafPaint, 260);
        const ro = window.ResizeObserver ? new ResizeObserver(rafPaint) : null;
        if (ro) {
            ro.observe(root);
            summaryCardRefs.current.forEach((node) => {
                if (node) {
                    ro.observe(node);
                }
            });
        }
        window.addEventListener('resize', rafPaint);
        return () => {
            window.removeEventListener('resize', rafPaint);
            window.clearTimeout(timer);
            if (ro) {
                ro.disconnect();
            }
        };
    }, [summaryCards, currentLang]);

    const renderStackWords = (words, zoneKey) => words.map((item, idx) => {
        const isGroupActive = Boolean(hoveredStackGroup) && hoveredStackGroup === item.groupKey;
        const isGroupMuted = Boolean(hoveredStackGroup) && hoveredStackGroup !== item.groupKey;
        return <button
            type='button'
            key={`${zoneKey}-${item.name}-${idx}`}
            className={`${s.stackWord} ${item.tier === 1 ? s.stackWordTier1 : item.tier === 2 ? s.stackWordTier2 : item.tier === 3 ? s.stackWordTier3 : s.stackWordTier4} ${isGroupActive ? s.stackWordGroupActive : ''} ${isGroupMuted ? s.stackWordGroupMuted : ''}`}
            onMouseEnter={() => setHoveredStackGroup(item.groupKey)}
            onMouseLeave={() => setHoveredStackGroup('')}
            onFocus={() => setHoveredStackGroup(item.groupKey)}
            onBlur={() => setHoveredStackGroup('')}
            title={item.name}
        >
            {item.icon ? <img src={item.icon} alt='' loading='lazy' /> : <i>{item.emoji || '•'}</i>}
            <b>{item.name}</b>
        </button>;
    });

    const renderExperienceCard = (item, keyPrefix = '') => {
        const isActive = item.links.some((linkId) => activeRelationIds.includes(linkId));
        const activeLinkId = item.links.find((linkId) => activeRelationIds.includes(linkId));
        const activeAccent = activeLinkId ? relationAccentMap[activeLinkId] : null;
        const hasImageIcon = Boolean(item.iconKey);
        const canShowImageIcon = hasImageIcon && !iconLoadErrorMap[item.iconKey];
        return <article key={`${keyPrefix}${item.id}`} className={`${s.experienceCard} ${isActive ? s.experienceCardActive : ''}`} style={{'--experience-bg-image': item.cardBgImage ? `url("${item.cardBgImage}")` : 'none', '--experience-bg-opacity': String(item.cardBgOpacity ?? 0.14), '--experience-bg-saturate': String(item.cardBgSaturate ?? 0.92), ...(isActive && activeAccent ? {'--relation-accent-start': activeAccent.start, '--relation-accent-end': activeAccent.end, '--relation-accent': activeAccent.end, '--relation-glow': activeAccent.glow} : {})}} ref={(node) => { experienceRefs.current[item.id] = node; }} onMouseEnter={() => setActiveRelationIds(item.links)} onClick={() => { setPinnedRelationIds(item.links); setActiveRelationIds(item.links); }} role='button' tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPinnedRelationIds(item.links); setActiveRelationIds(item.links); } }}>
            <div className={s.experienceTop}>
                <div className={s.experienceIdentity}>
                    <div className={s.iconSlot}>
                        {canShowImageIcon ? <img src={`/ushouldknow-icons/${item.iconKey}.png`} alt='' onError={() => { setIconLoadErrorMap((prev) => ({...prev, [item.iconKey]: true})); }} /> : null}
                        <span className={canShowImageIcon ? s.iconFallbackHidden : ''}>{item.iconFallback}</span>
                    </div>
                    {item.companyHomepage ? <a className={s.experienceCompanyLink} href={item.companyHomepage} target='_blank' rel='noreferrer' onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}><strong>{item.company}</strong></a> : <strong>{item.company}</strong>}
                </div>
                <span className={s.experiencePeriod}>{item.period}</span>
            </div>
            <p className={s.experienceRole}>{item.role}</p>
            <div className={s.experienceCanvasSlot} aria-hidden />
            <div className={s.experienceBottom}>
                <div className={s.experienceTagList}>{item.tags.map((tag) => <span key={`${item.id}-${tag}`}>{tag}</span>)}</div>
                <div className={s.experienceLinkTags}>{item.links.map((linkId) => { const target = achievementById.get(linkId); return <span key={`${item.id}-${linkId}`}>{target ? target.project.split('：')[0] : linkId}</span>; })}</div>
            </div>
        </article>;
    };

    const renderAchievementCard = (item, keyPrefix = '') => {
        const isActive = activeRelationIds.includes(item.id);
        const noteParts = splitAchievementNote(item.note);
        const activeAccent = relationAccentMap[item.id];
        return <article key={`${keyPrefix}${item.id}-${item.project}`} className={`${s.achievementCard} ${isActive ? s.achievementCardActive : ''}`} style={isActive && activeAccent ? {'--relation-accent-start': activeAccent.start, '--relation-accent-end': activeAccent.end, '--relation-accent': activeAccent.end, '--relation-glow': activeAccent.glow} : undefined} ref={(node) => { achievementRefs.current[item.id] = node; }} onMouseEnter={() => setActiveRelationIds([item.id])} onClick={() => { setPinnedRelationIds([item.id]); setActiveRelationIds([item.id]); }} role='button' tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPinnedRelationIds([item.id]); setActiveRelationIds([item.id]); } }}>
            <div className={s.achievementHead}><strong>{item.project}</strong>{noteParts.period ? <span className={s.achievementPeriod}>{noteParts.period}</span> : null}</div>
            <span>{item.outcome}</span>
            {noteParts.detail ? <em className={s.achievementMeta}>{noteParts.detail}</em> : null}
            <div className={s.achievementTagList}>{item.labels.map((label) => <i key={`${item.id}-${label}`}>{label}</i>)}</div>
        </article>;
    };

    return <main
        id='ushouldknow-scroll-root'
        className={`${s.page} ${displayCustomCursor ? s.hiddenCursor : s.staticCursor}`}
        style={pageBackgroundStyle}
        onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100));
            const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100));
            event.currentTarget.style.setProperty('--mx', `${x}%`);
            event.currentTarget.style.setProperty('--my', `${y}%`);
            event.currentTarget.style.setProperty('--mouse-x', `${event.clientX}px`);
            event.currentTarget.style.setProperty('--mouse-y', `${event.clientY}px`);
        }}
    >
        <Cursor display={displayCustomCursor}/>
        {!isCompactViewport ? <ShowR0 style={{
            position: 'fixed',
            left: '28px',
            bottom: '3px',
            zIndex: 118,
            transform: 'scale(0.9)',
            transformOrigin: 'left bottom',
        }} navigatePath='/'/> : null}
        <div className={s.dynamicGlow}/>
        {showHeroNameTip ? <div className={s.heroCursorTip}>{'Ciallo～(∠・ω< )⌒☆'}</div> : null}
        <div className={s.symbolRain}>
            {particles.map((particle) => <span key={particle.key} className={s.symbolParticle} style={{left: `${particle.x}%`, top: `${particle.y}%`, fontSize: `${particle.scale}rem`, opacity: particle.opacity, animationDelay: particle.delay, animationDuration: particle.duration}}>{particle.text}</span>)}
        </div>

        <header className={s.fixedHud}>
            <div className={s.langSwitch}>
                {langTabs.map((item) => <button type='button' key={item.key} className={`${s.langBtn} ${item.key === currentLang ? s.langBtnActive : ''}`} onClick={() => navigate(item.path)}>{item.label}</button>)}
            </div>
            <div className={s.progressLayer} aria-hidden>
                <div className={s.progressTrack}><span style={{width: `${progress}%`}} /></div>
                <div className={s.progressFaceCluster} style={{left: `${progress}%`}}>
                    {progressFaceTrail.map((face) => <span key={face.key} className={s.progressFace} style={{animationDelay: face.delay}}>{face.text}</span>)}
                </div>
            </div>
        </header>

        <div className={s.deck}>
            <section className={`${s.slide} ${s.slideActive}`}>
                <article className={s.slideCard}>
                    <div className={s.slideHead}>
                        <div className={s.heroAsciiWrap} aria-label='HANYUAN LING'>
                            <pre className={`${s.heroAscii} ${s.heroAsciiBack}`} aria-hidden>{heroAscii}</pre>
                            <pre className={s.heroAscii} aria-hidden>{heroAscii}</pre>
                        </div>
                        <div className={s.heroFacts}>
                            <p className={s.heroFactRow}>
                                <span
                                    className={`${s.heroFactItem} ${s.heroFactName}`}
                                    onMouseEnter={() => setShowHeroNameTip(true)}
                                    onMouseLeave={() => setShowHeroNameTip(false)}
                                    onFocus={() => setShowHeroNameTip(true)}
                                    onBlur={() => setShowHeroNameTip(false)}
                                >
                                    {currentLang === 'ja' ? <ruby className={s.heroNameRuby}>凌瀚遠<rt>リョウ カンエン</rt></ruby> : <span>{primaryNameFact}</span>}
                                    {currentLang === 'en' ? <span className={s.heroNameEnSub}>LING HANYUAN</span> : null}
                                </span>
                                {profileFactsTopTail.map((item, idx) => <span key={`fact-top-tail-${idx}-${item}`} className={s.heroFactItem}>
                                    <span className={s.heroFactsDot}> · </span>
                                    {item}
                                </span>)}
                            </p>
                            <p className={`${s.heroFactRow} ${s.heroFactRowSecondary}`}>
                                {profileFactsBottom.map((item, idx) => <span key={`fact-bottom-${idx}-${item}`} className={s.heroFactItem}>
                                    {idx > 0 ? <span className={s.heroFactsDot}> · </span> : null}
                                    {item}
                                </span>)}
                                <span className={s.heroRowSignature} aria-hidden>
                                    <img src={signLineImg} alt='' />
                                </span>
                            </p>
                        </div>
                        <div className={s.contactInline}>
                            <a href={`mailto:${contactProfile.email}`} className={s.contactInlineItem}>
                                <span className={s.contactInlineIcon}><ContactIcon type='email'/></span>
                                <span>{contactProfile.email}</span>
                            </a>
                            <span className={s.contactInlineSep}>/</span>
                            <span className={s.contactInlineItem}>
                                <span className={s.contactInlineIcon}><ContactIcon type='phone'/></span>
                                <span>{localizedPhone}</span>
                            </span>
                            <span className={s.contactInlineSep}>/</span>
                            <span className={s.contactInlineItem}>
                                <span className={s.contactInlineIcon}><ContactIcon type='wechat'/></span>
                                <span>{contactProfile.wechat}</span>
                            </span>
                            <span className={s.contactInlineSep}>/</span>
                            <a href={contactProfile.website} target='_blank' rel='noreferrer' className={s.contactInlineItem}>
                                <span className={s.contactInlineIcon}><ContactIcon type='web'/></span>
                                <span>{contactProfile.website.replace('https://', '')}</span>
                            </a>
                            <span className={s.contactInlineSep}>/</span>
                            <a href={contactProfile.instagram} target='_blank' rel='noreferrer' className={s.contactInlineItem}>
                                <span className={s.contactInlineIcon}><ContactIcon type='instagram'/></span>
                                <span>{contactProfile.instagram.replace(/^https?:\/\/(www\.)?/u, '')}</span>
                            </a>
                            <span className={s.contactInlineSep}>/</span>
                            <a href={contactProfile.github} target='_blank' rel='noreferrer' className={s.contactInlineItem}>
                                <span className={s.contactInlineIcon}><ContactIcon type='github'/></span>
                                <span>{contactProfile.github.replace('https://', '')}</span>
                            </a>
                        </div>
                        <div className={s.careerTimelineWrap}>
                            {isCompactViewport ? <span className={s.mobileTimelineSignature} aria-hidden>
                                <img src={signLineImg} alt='' />
                            </span> : null}
                            <div className={s.careerTimeline} aria-label='career timeline'>
                                {careerTimeline.map((item, idx) => <Fragment key={`timeline-${item.id}`}>
                                    <article className={s.timelineItem} style={{'--timeline-stage': String(item.timelineStage), '--timeline-span': String(item.timelineSpan)}}>
                                        <div className={s.timelineAxis}>
                                            <span className={`${s.timelinePoint} ${s.timelinePointLeft} ${item.isCurrentNode ? s.timelinePointCurrent : ''}`}>
                                                <span className={`${s.timelineTime} ${item.timelineLeftTimeTop ? s.timelineTimeTop : s.timelineTimeBottom}`}>{item.timelineLeftTime}</span>
                                                <span className={s.timelineDot} aria-hidden />
                                            </span>
                                            <span className={s.timelineLine} aria-hidden />
                                            {item.timelineHasRightPoint ? <span className={`${s.timelinePoint} ${s.timelinePointRight}`}>
                                                <span className={`${s.timelineTime} ${item.timelineRightTimeTop ? s.timelineTimeTop : s.timelineTimeBottom}`}>{item.timelineRightTime}</span>
                                                <span className={s.timelineDot} aria-hidden />
                                            </span> : null}
                                        </div>
                                        <div className={`${s.timelineCard} ${item.timelineCompact ? s.timelineCardCompact : ''}`}>
                                            <b className={s.timelineCompany}>{item.company}</b>
                                            <span className={s.timelineRole}>{item.timelineRoleTitle}</span>
                                            {item.timelineRoleDepartment ? <span className={s.timelineDepartment}>{item.timelineRoleDepartment}</span> : null}
                                        </div>
                                    </article>
                                    {idx < careerTimeline.length - 1 ? <span
                                        className={`${s.timelineConnector} ${item.timelineHasGap ? s.timelineConnectorDashed : s.timelineConnectorSolid}`}
                                        style={{'--timeline-stage': String(Math.max(0, item.timelineStage - 0.9)), '--timeline-span': String(item.timelineConnectorSpan)}}
                                        aria-hidden
                                    /> : null}
                                </Fragment>)}
                            </div>
                        </div>
                        <div className={s.metricRibbon}>
                            {c.summaryRibbon.map((item) => {
                                const isActive = item.id === activeMetricId;
                                const bgImage = metricCardBgMap[item.id];
                                return <article
                                    key={item.id}
                                    className={`${s.metricCard} ${isActive ? s.metricCardActive : ''}`}
                                    style={isActive && bgImage ? {'--metric-bg-image': `url("${bgImage}")`} : undefined}
                                >
                                    <strong>{item.title}</strong>
                                    <span>{item.detail}</span>
                                    <em>{item.stack}</em>
                                </article>;
                            })}
                        </div>
                    </div>

                    <div className={s.achievementBoard} onMouseLeave={() => setActiveRelationIds(pinnedRelationIds)}>
                        {isCompactViewport ? <div className={s.relationMobileSequence}>
                            {c.introExperiences.map((experience) => {
                                const linkedAchievements = experience.links.map((achievementId) => achievementById.get(achievementId)).filter(Boolean);
                                return <div key={`mobile-seq-${experience.id}`} className={s.relationMobileBlock}>
                                    {renderExperienceCard(experience, 'mobile-exp-')}
                                    <div className={s.relationMobileProjectList}>
                                        {linkedAchievements.map((achievement) => renderAchievementCard(achievement, `mobile-ach-${experience.id}-`))}
                                    </div>
                                </div>;
                            })}
                        </div> : <div className={s.relationBoard} ref={relationBoardRef}>
                            <svg className={s.relationSvg}>
                                <defs>
                                    {Array.from(new Set(relationLines.map((line) => line.gradientId))).map((gradientId) => {
                                        const target = relationLines.find((line) => line.gradientId === gradientId);
                                        if (!target) {
                                            return null;
                                        }
                                        return <linearGradient key={gradientId} id={gradientId} x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stopColor={target.gradientStart}/><stop offset='100%' stopColor={target.gradientEnd}/></linearGradient>;
                                    })}
                                </defs>
                                {relationLines.map((line) => {
                                    const isActive = activeRelationIds.includes(line.relationId);
                                    return <path key={line.key} d={line.d} className={`${s.relationPath} ${isActive ? s.relationPathActive : ''}`} style={isActive ? {stroke: `url(#${line.gradientId})`, '--line-glow': line.glow} : {stroke: 'rgba(99, 110, 114, 0.45)', '--line-glow': 'rgba(99, 110, 114, 0.2)'}} />;
                                })}
                            </svg>
                            <div className={s.relationExperiences}>
                                {c.introExperiences.map((item) => renderExperienceCard(item, 'desktop-exp-'))}
                            </div>
                            <div className={s.relationAchievements}>
                                {c.introAchievements.map((item) => renderAchievementCard(item, 'desktop-ach-'))}
                            </div>
                        </div>}
                    </div>

                    <div className={s.resumeGrid}>
                        <section className={`${s.resumePanel} ${s.trackPanel}`}>
                            <div
                                className={s.trackWorkspace}
                                style={{
                                    '--track-accent': activeTrackAccent,
                                    '--track-workspace-height': `${trackLayoutPreset.workspaceHeight}px`,
                                    '--track-detail-height': `${trackLayoutPreset.detailHeight}px`,
                                }}
                            >
                                <div className={s.trackBottom} onMouseEnter={() => setIsTrackDetailHover(true)} onMouseLeave={() => { setHoveredStackGroup(''); setIsTrackDetailHover(false); }}>
                                    <div className={`${s.stackZone} ${s.stackZoneTop}`}>
                                        {renderStackWords(stackWordsByZone.top, 'top')}
                                    </div>
                                    <div className={`${s.stackZone} ${s.stackZoneLeft}`}>
                                        {renderStackWords(stackWordsByZone.left, 'left')}
                                    </div>
                                    {activeTrack ? <div className={s.trackDetail}><div className={s.trackDetailHead}><strong>{activeTrack.name}</strong><span>{activeTrack.value}%</span></div><ul>{activeTrackDetails.map((detail) => <li key={`${activeTrack.id}-${detail}`}>{detail}</li>)}</ul></div> : null}
                                    <div className={`${s.stackZone} ${s.stackZoneRight}`}>
                                        {renderStackWords(stackWordsByZone.right, 'right')}
                                    </div>
                                    <div className={`${s.stackZone} ${s.stackZoneBottom}`}>
                                        {renderStackWords(stackWordsByZone.bottom, 'bottom')}
                                    </div>
                                </div>
                                <div className={`${s.trackList} ${s.trackListGrid}`}>
                                    {orderedCapabilityTracks.map((track) => <button
                                        type='button'
                                        className={`${s.trackItem} ${activeTrack?.id === track.id ? s.trackItemActive : ''}`}
                                        key={track.id}
                                        onClick={() => setActiveTrackId(track.id)}
                                    ><div className={s.trackTop}><span>{track.name}</span><span>{track.value}%</span></div><div className={s.trackBar}><span style={{width: `${track.value}%`}}/></div><p>{track.summary}</p></button>)}
                                </div>
                            </div>
                        </section>

                        <section className={`${s.resumePanel} ${s.summaryPanel}`}>
                            <div className={s.summaryFusion} ref={summaryFusionRef}>
                                {summaryCards.map((item, idx) => {
                                    if (item.type === 'domain') {
                                        const domain = item.payload;
                                        return <article
                                            key={item.key}
                                            ref={(node) => { summaryCardRefs.current[idx] = node; }}
                                            className={`${s.highlightCard} ${s.summaryFusionCard}`}
                                        >
                                            <em className={s.summaryFusionType}>{sectionMeta.domain}</em>
                                            <h4>{domain.title}</h4>
                                            <ul className={s.summaryFusionList}>
                                                {domain.points.map((point) => <li key={`${domain.id}-${point}`}>{point}</li>)}
                                            </ul>
                                        </article>;
                                    }
                                    const card = item.payload;
                                    return <article
                                        key={item.key}
                                        ref={(node) => { summaryCardRefs.current[idx] = node; }}
                                        className={`${s.highlightCard} ${s.summaryFusionCard} ${s.summaryProjectCard}`}
                                    >
                                        <em className={s.summaryFusionType}>{sectionMeta.project}</em>
                                        <div className={s.summaryFusionHead}>
                                            <h4>{card.title}</h4>
                                            {card.github ? <a className={s.summaryGithubLink} href={card.github} target='_blank' rel='noreferrer' aria-label='GitHub'>
                                                <ContactIcon type='github'/>
                                            </a> : null}
                                        </div>
                                        <p>{card.desc}</p>
                                        <span>{card.metric}</span>
                                        <div className={s.highlightTagList}>{card.labels.map((label) => <i key={`${card.title}-${label}`}>{label}</i>)}</div>
                                    </article>;
                                })}
                            </div>
                            <div className={s.eduAwardGrid}>
                                <section className={s.eduAwardBlock}>
                                    <h3>{sectionMeta.education}</h3>
                                    {educationRows.map((item) => <div className={s.milestoneItem} key={`${item.period}-${item.degree}`}>
                                        <div className={s.milestoneHead}>
                                            <span>{item.degree}</span>
                                            <strong>{item.period}</strong>
                                        </div>
                                        <em>{item.school}</em>
                                        {Array.isArray(item.honors) && item.honors.length ? <ul className={s.educationHonors}>{item.honors.map((honor) => <li key={`${item.period}-${honor}`}>{honor}</li>)}</ul> : null}
                                    </div>)}
                                </section>
                                <section className={s.eduAwardBlock}>
                                    <h3>{sectionMeta.awards}</h3>
                                    <div className={s.winList}>{c.wins.map((item) => <span key={item.id} className={s.winItem} style={{'--award-color': item.color}}><i>{item.emoji}</i><b>{item.label}</b><em>{item.medal}</em></span>)}</div>
                                </section>
                            </div>
                        </section>
                    </div>

                </article>
            </section>
        </div>
    </main>;
};

export default UShouldKnow;
