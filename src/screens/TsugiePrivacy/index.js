import {memo, useMemo, useState} from 'react';
import ReactDocumentTitle from '@/utils/title';
import globalStore from '@/stores/globalStore';
import s from './index.module.less';

const languageOptions = [
    {code: 'zh', label: '中文'},
    {code: 'en', label: 'English'},
    {code: 'ja', label: '日本語'}
];

const detectInitialLanguage = () => {
    if (typeof navigator === 'undefined') {
        return 'en';
    }
    const raw = (navigator.language || '').toLowerCase();
    if (raw.startsWith('ja')) {
        return 'ja';
    }
    if (raw.startsWith('zh')) {
        return 'zh';
    }
    return 'en';
};

const privacyCopy = {
    zh: {
        pageTitle: 'Tsugie 隐私政策',
        effectiveDate: '生效日期：2026-02-22',
        updatedDate: '最后更新：2026-02-22',
        appliesTo: '适用产品：Tsugie iOS 应用（当前版本）',
        productNature: '产品性质声明：Tsugie 当前版本为单机本地优先应用。除你主动发起导航跳转或打开活动来源链接外，不向用户提供基于互联网的信息发布、复制、传播或互动服务；核心功能在设备端完成，不依赖账号体系，不接入第三方广告/统计/归因 SDK。当前版本采用 App Store 付费下载（买断）模式，支付与兑换流程由 Apple 官方体系处理。',
        tableHeaders: ['数据项', '来源与收集方式', '用途', '共享情况', '保留规则'],
        rows: [
            {
                item: '位置信息（仅在授权后）',
                source: 'iOS CoreLocation（设备侧）',
                purpose: '计算附近活动、距离排序、地图中心定位',
                sharing: '不在 Tsugie 服务端持久化；用户主动发起导航时会跳转至 Apple 地图或 Google 地图，由对应服务处理',
                retention: '仅用于当次会话计算，不作为账户档案长期保存'
            },
            {
                item: '通知权限状态与本地提醒任务',
                source: 'iOS 通知框架（设备侧）',
                purpose: '活动开始前提醒',
                sharing: '不用于广告投放，不对外出售；当前版本不接入远程推送 token',
                retention: '保留至提醒触发、你手动关闭提醒或卸载 App'
            },
            {
                item: '本地偏好与状态（语言、筛选、收藏、打卡、隐私确认状态）',
                source: 'UserDefaults / 本地存储（设备侧）',
                purpose: '保留你的使用偏好与本地记录',
                sharing: '不上传为公开社交数据，不用于跨应用跟踪',
                retention: '保留至你在 App 内清理本地数据或卸载 App'
            }
        ],
        sections: [
            {
                title: '1. 政策范围与原则',
                paragraphs: ['本政策仅针对 Tsugie 当前版本的实际数据处理行为。我们遵循“最小必要、目的限定、默认本地化”的原则：不做账号体系，不做跨应用跟踪，不出售个人信息。除你主动发起导航跳转或打开活动来源链接外，不提供基于互联网的信息发布、复制、传播或互动服务；核心推荐链路在设备端完成，不依赖第三方 API 存储你的个人数据。']
            },
            {
                title: '2. 数据清单（收集方式 / 用途 / 共享 / 保留）',
                table: true
            },
            {
                title: '3. 我们不会收集或处理的数据（当前版本）',
                bullets: [
                    '不要求注册登录，不收集姓名、手机号、身份证号、支付信息。',
                    '不访问通讯录、相册、麦克风、摄像头。',
                    '不进行跨 App / 跨网站跟踪（Tracking），不使用广告标识符进行个性化广告。',
                    '不出售个人信息。'
                ]
            },
            {
                title: '4. 第三方服务与信息共享边界',
                bullets: [
                    '当前版本不接入第三方广告、统计、归因 SDK。',
                    '你在 App 内点击“导航”后，会跳转到你选择的地图服务（Apple 地图或 Google 地图）；你点击活动“来源链接”后，会跳转至对应第三方站点。跳转后产生的数据由对应服务方处理，遵循其隐私政策。',
                    '除法律法规要求或保护安全的必要情形外，我们不向第三方共享可识别你的个人信息。',
                    '如未来引入新的第三方 SDK 或新增数据用途，我们会先更新本政策与 App Store 隐私披露，再上线对应能力。'
                ]
            },
            {
                title: '5. 购买、支付与兑换码（App Store）',
                bullets: [
                    '当前版本为 App Store 付费下载（买断）应用。交易、扣款与账单流程由 Apple App Store 完成，我们不直接处理银行卡号、支付账户、支付密码等支付凭据。',
                    '你通过 App Store 官方 Promo Code（兑换码）免费兑换应用时，兑换、发放与账务记录由 Apple 处理；我们不建立站外支付通道，也不通过非 Apple 结算方式提供数字内容。',
                    '退款、取消与账单争议以 Apple 公示规则与流程为准。我们可提供必要的功能说明与协助材料，但不替代 Apple 的最终处理决定。',
                    '如未来引入应用内购买（IAP）或订阅能力，我们将在上线前更新本政策、App Store 隐私披露及相关价格/条款说明。'
                ]
            },
            {
                title: '6. 权限说明与拒绝后的影响',
                bullets: [
                    '定位权限：用于“附近活动推荐”。拒绝后，App 仍可浏览，但会回退到默认地点，附近推荐准确性会下降。',
                    '通知权限：用于“开始前提醒”。拒绝后，不影响浏览和收藏/打卡，仅无法收到提醒。'
                ]
            },
            {
                title: '7. 存储安全与保留删除',
                bullets: [
                    '本地数据默认存于你的设备；你可在 App 的「联系我们」中执行“清理本地数据”。',
                    '卸载 App 后，App 本地数据会随应用删除（受 iOS 系统机制影响）。',
                    '我们采取合理的技术与管理措施降低未授权访问、泄露或篡改风险。'
                ]
            },
            {
                title: '8. 你的权利与行使方式',
                bullets: [
                    '你可在 iOS 系统设置中随时撤回定位与通知授权。',
                    '你可在 App 内“联系我们”重新查看隐私政策并清理本地数据。',
                    '你可通过邮箱发起隐私请求（访问、更正、删除、投诉）。为保障安全，我们可能要求你提供必要信息进行身份核验。',
                    '我们将在收到请求后 15 个工作日内给出处理结果或阶段性反馈；情况复杂时会在法律允许范围内告知延期理由与预计完成时间。'
                ]
            },
            {
                title: '9. 未成年人保护',
                paragraphs: ['若你是未成年人，请在监护人指导下使用本应用。监护人如对信息处理有疑问，可通过本页联系方式与我们联系。'],
                bullets: [
                    '如你为不满 14 周岁的未成年人，应由监护人阅读并同意本政策后再使用本应用。',
                    '如我们发现未经监护人同意处理不满 14 周岁未成年人个人信息的情形，将依法尽快采取删除或纠正措施。'
                ]
            },
            {
                title: '10. 政策更新与一致性',
                paragraphs: ['当数据处理行为发生变化时，我们会先更新本政策，同时更新 App Store Connect 隐私披露信息，确保页面声明与实际行为一致。']
            },
            {
                title: '11. 联系我们',
                paragraphs: [
                    '个人信息处理者（开发者主体）：以 App Store Connect 中公示的开发者主体信息为准。',
                    '联系地址：以 App Store Connect 中公示的联系地址为准。',
                    '隐私相关邮箱：'
                ],
                showContactEmail: true,
                note: '为保护你的安全，请勿在邮件中提供与本请求无关的敏感信息（如证件号、银行卡号等）。'
            },
            {
                title: '12. 合规知悉、适用法律与法律责任',
                paragraphs: ['本政策所称“适用法律法规”，包括中华人民共和国大陆地区法律法规，以及中国大陆以外其他国家和地区中对你或本服务具有强制适用效力的法律法规（以服务投放地、用户所在地、数据处理发生地的法律连接点综合判断）。'],
                bullets: [
                    '你点击“我已阅读并同意”即表示已阅读并同意本政策，并承诺在适用法律法规范围内使用本应用。',
                    '你不得利用本应用从事任何违法违规活动，不得侵害国家、社会公共利益或他人合法权益；相关法律责任由行为人依法承担。',
                    '在法律允许范围内，因不可抗力、基础通信网络故障、第三方地图服务规则变化或系统维护导致的服务中断或异常，我们将在合理范围内尽快修复，但本条不构成对法定义务或法定责任的豁免。'
                ]
            },
            {
                title: '13. 跨境传输与第三方地图边界（当前版本）',
                bullets: [
                    '当前版本不建立用户账号，不向 Tsugie 自建服务器上传可识别个人信息，也不以我们控制的方式开展跨境传输。',
                    '仅在你主动点击导航并跳转至 Apple 地图或 Google 地图时，导航所需信息将由对应地图服务方按其规则处理。',
                    '如未来新增服务器上传、跨境传输或第三方 SDK，我们将在上线前完成政策更新并依法履行告知义务。'
                ]
            },
            {
                title: '14. 语言版本与安全事件通知',
                bullets: [
                    '本政策提供中文、英文、日文版本；如不同版本存在歧义，在法律允许范围内以中文（简体）版本为准；但强制性法律另有规定的，从其规定。',
                    '如发生可能影响个人信息安全的事件，我们将依据适用法律法规及时采取处置措施，并在法律要求范围内履行通知义务。'
                ]
            }
        ]
    },
    en: {
        pageTitle: 'Tsugie Privacy Policy',
        effectiveDate: 'Effective date: 2026-02-22',
        updatedDate: 'Last updated: 2026-02-22',
        appliesTo: 'Product scope: Tsugie iOS app (current version)',
        productNature: 'Product statement: Tsugie (current version) is a local-first standalone app. Except when you intentionally launch external navigation or open event source links, it does not provide internet-based information publishing, replication, dissemination, or interactive information services. Core features run on-device, with no account system and no third-party ad/analytics/attribution SDKs. The current release uses paid download (one-time purchase) via the App Store, and payment/redeem flows are handled through Apple’s official system.',
        tableHeaders: ['Data item', 'Collection source', 'Purpose', 'Sharing scope', 'Retention'],
        rows: [
            {
                item: 'Location data (only after permission)',
                source: 'iOS CoreLocation (on-device)',
                purpose: 'Nearby ranking, distance sorting, map centering',
                sharing: 'Not persistently stored on Tsugie servers; if you start navigation, Apple Maps or Google Maps will process data under their own policies',
                retention: 'Used for in-session computation only'
            },
            {
                item: 'Notification permission state and local reminder tasks',
                source: 'iOS UserNotifications (on-device)',
                purpose: 'Before-start reminders',
                sharing: 'Not used for ad targeting, not sold; current version does not register remote push tokens',
                retention: 'Until reminder is delivered, disabled by you, or app uninstall'
            },
            {
                item: 'Local preferences and states (language, filters, favorite/check-in, privacy consent)',
                source: 'UserDefaults / local storage (on-device)',
                purpose: 'Preserve your app preferences and local records',
                sharing: 'Not published as social data, not used for cross-app tracking',
                retention: 'Until you clear local data in app or uninstall'
            }
        ],
        sections: [
            {
                title: '1. Scope and principles',
                paragraphs: ['This policy describes the actual data handling behavior of the current Tsugie version. We follow data minimization, purpose limitation, and local-first storage. No account system, no cross-app tracking, and no sale of personal data. Except when you intentionally launch external navigation or open event source links, we do not provide internet-based publishing, replication, dissemination, or interactive information services. Core recommendation flows run on-device and do not rely on third-party APIs to persist your personal data.']
            },
            {
                title: '2. Data inventory (collection / purpose / sharing / retention)',
                table: true
            },
            {
                title: '3. Data we do not collect (current version)',
                bullets: [
                    'No sign-up required; no collection of legal name, phone number, ID number, or payment details.',
                    'No access to contacts, photos, microphone, or camera.',
                    'No cross-app or cross-site tracking; no personalized ads based on ad identifiers.',
                    'No sale of personal information.'
                ]
            },
            {
                title: '4. Third-party services and sharing boundary',
                bullets: [
                    'Current version does not include third-party ad, analytics, or attribution SDKs.',
                    'When you tap navigation in app, you are redirected to Apple Maps or Google Maps; when you open an event source link, you are redirected to the corresponding third-party website. Data generated after redirection is governed by the selected provider.',
                    'We do not share personally identifiable information except where legally required or necessary to protect safety.',
                    'If new third-party SDKs or new data uses are introduced, we will update this policy and App Store privacy disclosures before release.'
                ]
            },
            {
                title: '5. Purchase, payment, and promo codes (App Store)',
                bullets: [
                    'The current release is a paid-download (one-time purchase) app distributed via the App Store. Transaction, charge, and billing flows are processed by Apple App Store. We do not directly process card numbers, payment accounts, or payment passwords.',
                    'If you redeem the app through Apple’s official Promo Code mechanism, redemption, code issuance, and billing records are processed by Apple. We do not provide off-store payment channels and do not deliver digital content through non-Apple settlement paths.',
                    'Refunds, cancellations, and billing disputes are handled under Apple’s published rules and process. We may provide necessary product explanations and support materials, but we do not replace Apple’s final decision.',
                    'If future releases introduce in-app purchases (IAP) or subscriptions, we will update this policy, App Store privacy disclosures, and relevant price/term notices before release.'
                ]
            },
            {
                title: '6. Permission usage and impact if denied',
                bullets: [
                    'Location permission: used for nearby recommendations. If denied, browsing remains available, but recommendations fall back to a default location.',
                    'Notification permission: used for before-start reminders. If denied, browsing and favorite/check-in still work, but reminders are unavailable.'
                ]
            },
            {
                title: '7. Storage security, retention, and deletion',
                bullets: [
                    'Local data stays on your device by default; you can clear local data from Contact in app.',
                    'When the app is uninstalled, local app data is removed by iOS platform behavior.',
                    'We apply reasonable technical and organizational safeguards against unauthorized access, leakage, or tampering.'
                ]
            },
            {
                title: '8. Your rights and how to exercise them',
                bullets: [
                    'You can revoke location and notification permissions anytime in iOS Settings.',
                    'You can revisit this policy and clear local data from Contact in app.',
                    'You may email privacy requests (access, correction, deletion, complaint). To protect security, we may request necessary information for identity verification.',
                    'We provide a result or status update within 15 business days after receiving your request. If a case is complex, we will notify you of lawful extension reasons and the expected timeline.'
                ]
            },
            {
                title: '9. Minors',
                paragraphs: ['If you are a minor, please use the app with guardian guidance. Guardians may contact us using the email below.'],
                bullets: [
                    'If you are under the age of 14, your guardian should review and consent to this policy before you use the app.',
                    'If we learn that personal data of a user under 14 was processed without guardian consent, we will take prompt deletion or correction measures as required by law.'
                ]
            },
            {
                title: '10. Policy updates and consistency',
                paragraphs: ['When data handling changes, we update this page and App Store Connect privacy disclosures before rollout.']
            },
            {
                title: '11. Contact',
                paragraphs: [
                    'Personal information processor (developer entity): subject information displayed in App Store Connect.',
                    'Contact address: address displayed in App Store Connect.',
                    'Privacy contact email:'
                ],
                showContactEmail: true,
                note: 'For your safety, do not include unnecessary sensitive data (for example ID numbers or bank details) in email.'
            },
            {
                title: '12. Compliance notice, applicable law, and legal responsibility',
                paragraphs: ['In this policy, "applicable laws and regulations" include laws in Mainland China and any mandatory laws outside Mainland China that apply to you or this service, based on legal connecting factors such as service offering location, user location, and place of data processing.'],
                bullets: [
                    'By tapping "I have read and agree", you confirm you have read and agreed to this policy and will use this app in compliance with applicable laws and regulations.',
                    'You must not use this app for unlawful activities or to infringe public or third-party rights; legal liability arising from unlawful conduct is borne by the responsible actor according to law.',
                    'To the extent permitted by law, if service interruption or abnormality is caused by force majeure, underlying network failure, third-party map rule changes, or system maintenance, we will use reasonable efforts to restore service promptly. This clause does not waive any non-excludable statutory obligations or liabilities.'
                ]
            },
            {
                title: '13. Cross-border transfer and map-provider boundary (current version)',
                bullets: [
                    'Current version has no user account system and does not upload personally identifiable information to Tsugie-operated servers; we do not conduct cross-border transfer under our control.',
                    'Only when you intentionally start navigation and jump to Apple Maps or Google Maps, necessary navigation data is handled by the selected map provider under its own policy.',
                    'If future versions introduce server uploads, cross-border transfers, or new third-party SDKs, we will update this policy and complete required notices before release.'
                ]
            },
            {
                title: '14. Language versions and security incident notice',
                bullets: [
                    'This policy is provided in Chinese, English, and Japanese. If there is any inconsistency, Simplified Chinese prevails to the extent permitted by law, unless mandatory local law requires otherwise.',
                    'If a personal-information security incident may affect users, we will take prompt response measures and perform legal notification duties as required by applicable law.'
                ]
            }
        ]
    },
    ja: {
        pageTitle: 'Tsugie プライバシーポリシー',
        effectiveDate: '施行日: 2026-02-22',
        updatedDate: '最終更新日: 2026-02-22',
        appliesTo: '対象: Tsugie iOS アプリ（現行版）',
        productNature: 'サービス形態: Tsugie（現行版）はローカル優先のスタンドアロンアプリです。ユーザーが自ら外部ナビを起動する場合またはイベント情報ソースリンクを開く場合を除き、インターネットを通じた情報の発信・複製・伝達・相互交流サービスは提供しません。主要機能は端末内で完結し、アカウント機能および第三者広告/解析/アトリビューション SDK は導入していません。現行版は App Store の有料ダウンロード（買い切り）方式で、決済・コード交換は Apple 公式フローで処理されます。',
        tableHeaders: ['データ項目', '取得元・方法', '利用目的', '共有範囲', '保存期間'],
        rows: [
            {
                item: '位置情報（許可後のみ）',
                source: 'iOS CoreLocation（端末内）',
                purpose: '近傍候補の算出、距離順並び替え、地図中心の決定',
                sharing: 'Tsugie サーバーに恒久保存しません。ナビ開始時は Apple マップ / Google マップ側の規約で処理されます',
                retention: '当該セッションでの計算に限定して利用'
            },
            {
                item: '通知許可状態とローカル通知タスク',
                source: 'iOS UserNotifications（端末内）',
                purpose: '開始前リマインド通知',
                sharing: '広告配信に利用せず、販売もしません。現行版はリモート push token を登録しません',
                retention: '通知配信完了、設定オフ、またはアプリ削除まで'
            },
            {
                item: 'ローカル設定・状態（言語、フィルタ、お気に入り/チェックイン、同意状態）',
                source: 'UserDefaults / 端末内ストレージ',
                purpose: '利用設定とローカル記録の保持',
                sharing: '公開 SNS データ化なし、クロスアプリ追跡なし',
                retention: 'アプリ内削除またはアプリ削除まで'
            }
        ],
        sections: [
            {
                title: '1. 適用範囲と基本方針',
                paragraphs: ['本ポリシーは Tsugie 現行版の実際のデータ取扱いを対象とします。最小限収集・目的限定・ローカル優先を原則とし、アカウント機能、クロスアプリ追跡、個人データ販売は行いません。ユーザーが自ら外部ナビを起動する場合またはイベント情報ソースリンクを開く場合を除き、インターネットを通じた情報の発信・複製・伝達・相互交流サービスは提供しません。主要な推薦処理は端末内で完結し、個人データ保存のために第三者 API へ依存しません。']
            },
            {
                title: '2. データ一覧（取得 / 目的 / 共有 / 保持）',
                table: true
            },
            {
                title: '3. 収集しない情報（現行版）',
                bullets: [
                    '会員登録不要。氏名、電話番号、身分証番号、決済情報は収集しません。',
                    '連絡先、写真、マイク、カメラにはアクセスしません。',
                    'クロスアプリ / クロスサイト追跡を行わず、広告識別子を使ったパーソナライズ広告も行いません。',
                    '個人情報の販売は行いません。'
                ]
            },
            {
                title: '4. 第三者サービスと共有境界',
                bullets: [
                    '現行版は第三者広告 SDK・解析 SDK・アトリビューション SDK を導入していません。',
                    'アプリ内でナビを開始すると、Apple マップまたは Google マップへ遷移します。イベント情報ソースリンクを開いた場合は、該当する第三者サイトへ遷移します。遷移先でのデータ処理は各サービスのポリシーに従います。',
                    '法令上必要な場合または安全保護上必要な場合を除き、個人を識別できる情報を第三者へ共有しません。',
                    '新規 SDK や新しい利用目的を追加する場合、公開前に本ポリシーと App Store の開示情報を更新します。'
                ]
            },
            {
                title: '5. 購入・決済・Promo Code（App Store）',
                bullets: [
                    '現行版は App Store の有料ダウンロード（買い切り）アプリです。取引、課金、請求処理は Apple App Store が行い、当方はカード番号・決済アカウント・決済パスワード等を直接取り扱いません。',
                    'Apple 公式の Promo Code による無料引き換えを行う場合、引き換え、コード発行、請求記録は Apple 側で処理されます。当方は App Store 外の決済導線を設けず、非 Apple 決済でデジタルコンテンツを提供しません。',
                    '返金、キャンセル、請求に関する異議は Apple の公表ルールおよび手続に従って処理されます。当方は必要な機能説明や補助資料を提供できますが、Apple の最終判断に代替するものではありません。',
                    '将来、アプリ内課金（IAP）やサブスクリプションを導入する場合は、提供前に本ポリシー、App Store のプライバシー開示、価格・条件表示を更新します。'
                ]
            },
            {
                title: '6. 権限の利用目的と拒否時の影響',
                bullets: [
                    '位置情報権限: 近傍おすすめ表示に利用。拒否時も閲覧は可能ですが、既定地点ベースの表示になります。',
                    '通知権限: 開始前リマインドに利用。拒否時も閲覧・お気に入り・チェックインは利用できますが、通知は届きません。'
                ]
            },
            {
                title: '7. 保存・安全管理・削除',
                bullets: [
                    'ローカルデータは既定で端末に保存されます。アプリ内「お問い合わせ」から削除できます。',
                    'アプリを削除すると、端末内アプリデータは iOS の仕様に従って削除されます。',
                    '不正アクセス、漏えい、改ざんの防止に向け、合理的な安全管理措置を講じます。'
                ]
            },
            {
                title: '8. 利用者の権利と行使方法',
                bullets: [
                    'iOS 設定から位置情報・通知権限をいつでも取り消せます。',
                    'アプリ内「お問い合わせ」から本ポリシー再確認とローカルデータ削除が可能です。',
                    '開示・訂正・削除・苦情等の請求はメールで受け付けます。安全確保のため、必要な範囲で本人確認情報の提出をお願いする場合があります。',
                    '請求受領後 15 営業日以内に結果または進捗を回答します。複雑な案件は、法令の範囲内で延長理由と見込み時期を通知します。'
                ]
            },
            {
                title: '9. 未成年者',
                paragraphs: ['未成年の方は保護者の指導のもとでご利用ください。保護者の方からの問い合わせも受け付けます。'],
                bullets: [
                    '14 歳未満の方は、保護者が本ポリシーを確認し同意したうえで本アプリをご利用ください。',
                    '保護者同意なく 14 歳未満の個人情報を取り扱った事実が判明した場合、法令に従い速やかに削除または是正措置を講じます。'
                ]
            },
            {
                title: '10. 政策改定と整合性',
                paragraphs: ['データ取扱いに変更がある場合は、本ページと App Store Connect の開示情報を更新したうえで提供します。']
            },
            {
                title: '11. お問い合わせ',
                paragraphs: [
                    '個人情報取扱事業者（開発者主体）：App Store Connect に表示される開発者主体情報に準拠します。',
                    '連絡先住所：App Store Connect に表示される連絡先住所に準拠します。',
                    'プライバシー窓口メール:'
                ],
                showContactEmail: true,
                note: '安全のため、メールには不要な機微情報（身分証番号・口座番号など）を記載しないでください。'
            },
            {
                title: '12. コンプライアンス認識・準拠法・法的責任',
                paragraphs: ['本ポリシーにおける「適用法令」には、中国本土法令に加え、サービス提供地・利用者所在地・データ処理地などの法的連結点により、利用者または本サービスに強行適用される本土外の法令を含みます。'],
                bullets: [
                    '「確認して同意する」を押すことで、本ポリシーを読み同意したうえで、適用法令の範囲内で本アプリを利用することを確認したものとみなします。',
                    '利用者は本アプリを違法・不当な目的で利用してはならず、国家・公共の利益または第三者の正当な権利利益を侵害してはなりません。違法行為に基づく法的責任は、当該行為者が法令に従って負担します。',
                    '法令で許容される範囲で、不可抗力、通信基盤障害、第三者地図サービスの仕様変更、またはシステム保守により中断・不具合が生じた場合、当方は合理的な範囲で速やかな復旧に努めます。なお、本条は法令上免除できない義務・責任を免除するものではありません。'
                ]
            },
            {
                title: '13. 越境移転と地図サービス提供者との境界（現行版）',
                bullets: [
                    '現行版はアカウント機能を持たず、Tsugie 管理サーバーへ個人を識別できる情報をアップロードしません。当方管理下での越境移転は行いません。',
                    '利用者が自らナビ起動して Apple マップまたは Google マップへ遷移した場合に限り、ナビに必要な情報は遷移先サービスの方針に従って処理されます。',
                    '将来、サーバー送信・越境移転・新規 SDK 導入が発生する場合は、提供前に本ポリシーを更新し、法令上必要な告知を実施します。'
                ]
            },
            {
                title: '14. 言語版の解釈と安全インシデント通知',
                bullets: [
                    '本ポリシーは中国語・英語・日本語で提供されます。内容に齟齬がある場合、法令で許容される範囲で簡体字中国語版を優先し、強行法規がある場合は当該法令に従います。',
                    '個人情報の安全に影響し得るインシデントが発生した場合、当方は速やかに対処し、適用法令が求める範囲で通知義務を履行します。'
                ]
            }
        ]
    }
};

const TsugiePrivacy = memo(() => {
    const [languageCode, setLanguageCode] = useState(detectInitialLanguage);
    const copy = useMemo(() => privacyCopy[languageCode] || privacyCopy.en, [languageCode]);

    return (
        <ReactDocumentTitle title={globalStore.webSiteTitle + ' - Tsugie Privacy'}>
            <div className={s.page}>
                <div className={s.container}>
                    <header className={s.header}>
                        <div className={s.languageSwitcher} role='tablist' aria-label='Privacy language switcher'>
                            {languageOptions.map((option) => (
                                <button
                                    key={option.code}
                                    type='button'
                                    role='tab'
                                    className={`${s.languageButton} ${languageCode === option.code ? s.languageButtonActive : ''}`}
                                    onClick={() => setLanguageCode(option.code)}
                                    aria-selected={languageCode === option.code}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <h1 className={s.title}>{copy.pageTitle}</h1>
                        <p className={s.meta}>{copy.effectiveDate}</p>
                        <p className={s.meta}>{copy.updatedDate}</p>
                        <p className={s.meta}>{copy.appliesTo}</p>
                        <p className={s.metaStrong}>{copy.productNature}</p>
                    </header>

                    {copy.sections.map((section) => (
                        <section className={s.section} key={section.title}>
                            <h2>{section.title}</h2>

                            {section.paragraphs?.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}

                            {section.table ? (
                                <div className={s.tableWrap}>
                                    <table className={s.table}>
                                        <thead>
                                            <tr>
                                                {copy.tableHeaders.map((header) => (
                                                    <th key={header}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {copy.rows.map((row) => (
                                                <tr key={row.item}>
                                                    <td>{row.item}</td>
                                                    <td>{row.source}</td>
                                                    <td>{row.purpose}</td>
                                                    <td>{row.sharing}</td>
                                                    <td>{row.retention}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : null}

                            {section.bullets?.length ? (
                                <ul>
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            ) : null}

                            {section.showContactEmail ? (
                                <p>
                                    <a href='mailto:ushouldknowr0@gmail.com' className={s.mailLink}>ushouldknowr0@gmail.com</a>
                                </p>
                            ) : null}

                            {section.note ? <p className={s.note}>{section.note}</p> : null}
                        </section>
                    ))}
                </div>
            </div>
        </ReactDocumentTitle>
    );
});

export default TsugiePrivacy;
