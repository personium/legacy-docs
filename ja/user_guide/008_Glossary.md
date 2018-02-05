# 用語集

##### [A](#anc_a) | [B](#anc_b) | [C](#anc_c) | D | [E](#anc_e) | [F](#anc_f) | G | H | [I](#anc_i) | J | K | L | [M](#anc_m) | [N](#anc_n) | [O](#anc_o) | [P](#anc_p) | Q | [R](#anc_r) | [S](#anc_s) | [T](#anc_t) | [U](#anc_u) | V | [W](#anc_w) | X | Y | Z


## <a name="anc_a"> A</a>
### ACL
<font size=1>[一般]</font> Access Control Listの略称。  
オブジェクトに付与するユーザのアクセス権限を列挙したリスト。PersoniumにおいてはCell,Boxに設定することができる。オブジェクトに付与した権限によって、どのユーザがアクセスを許可されているか、どのような制御命令の使用が許可されているかを定義する。  
（例：Read:読込許可、Write:編集許可、Read/Write:読込/編集許可）

### Account
<font size=1>[Personium]</font> セル制御オブジェクトの一つ。そのセルでのユーザ認証手段を表し１セルに複数の登録が可能。基本タイプ（デフォルトで選択される）ではアカウント名やパスワードといった情報によって構成される。またプラグインを導入することでOpenID Connectをはじめとする他の認証手段に対応させることも可能。個人のセルで複数の認証手段を登録するのに用いてもよいし、組織のセルで組織構成員を認証するのに用いてもよい。

### Association
<font size=1>[OData]</font> 2つ以上のEntityType（RDBにおけるテーブル）間の関係性を示す。1対のAssociationEndとその間の$linksによって構成される。  
「1対1」「1対多」「多対多」の種類に分けて扱われる。


### AssociationEnd
<font size=1>[OData]</font> Associationを構成するエンドポイントとなっているEntityType。1対のAssociationEndとその間の$linksによってAssociationが構成される。  


### Authentication
<font size=1>[一般]</font> 認証。Personiumのアカウント認証では、作成済みのアカウント名とパスワードでの認証を行い、トークンを取得する方式を採用している。  


## <a name="anc_b"> B</a>
### bar ファイル
<font size=1>[Personium]</font> box archive ファイルの略称。Boxの構成内容をまとめたアーカイブファイル。  
フォルダ内の階層構造でWebDAVコレクションの階層構造を表し、その階層毎にファイルを格納することで、WebDAV内に格納するファイルを保持する。
詳細は[barファイル](../apiref/current/301_Bar_File.md)参照。  


### Box
<font size=1>[Personium]</font> アプリケーションに用いるデータを格納する領域。自身もWebDAVコレクションの一つである。一意の名前とスキーマURLを持つ。Cellは、Box未作成でも初期状態で1つのBox（メインボックス） を持ち、削除は不可。


### Box インストール
<font size=1>[Personium]</font> barファイルを用いて、Boxを作成すること。詳細は[Boxインストール](../apiref/current/302_Box_Installation.md)APIを参照。


### Box レベル ACL
<font size=1>[Personium]</font> Box配下のリソース対するACL。詳細は[アクセス制御モデル](./002_Access_Control.md)参照。


## <a name="anc_c"> C</a>
### Cell
<font size=1>[Personium]</font> データ主体ごとのData Strore。個人で使う場合はPDS(Personal Data Store)となる。Personiumでは、データ主体という概念を人のみでなく組織やモノなどにも拡張したモデル化を行っているため、組織やモノのデータストアとしても使うことが可能。  
（例、私のCell, あなたのCell, ○○会社のCell, ○○部のCell, 私の車のCell）



### Cell制御オブジェクト
<font size=1>[Personium]</font> セルが持つ機能を個別に定義する定義体。Role,   Account, Box, ExtCell, ExtRoleなどがある。


### Cell レベル ACL
<font size=1>[Personium]</font> Boxレベルのアクセス権限を除いたCellへのACL。Cell制御オブジェクトの操作や配下のBoxに対するアクセス制御を定義する。


### Cell Profile
<font size=1>[Personium]</font> Personiumセルの情報を格納する定義体。ホームアプリケーション等のアプリケーションでセル名、イメージ、 そのセルの情報などを表示する項目。


### Collection （コレクション）
<font size=1>[WebDAV]</font> 通常のファイルシステムでいうところのフォルダ・ディレクトリに相当。Personiumでは通常のコレクションに加え、「OData Service Collection」「Engine Service Collection」という特殊コレクションを扱うことができる。


### ComplexType
<font size=1>[OData]</font> 下位属性を伴った属性を持つPropertyのこと。項目名はComplexTypeProperty。  
（例えば、「住所」をComplexTypeとすると、通り1・通り2・国・郵便番号・都道府県・市区町村などがComplexTypePropertyとなる。）


### ComplexTypeProperty
<font size=1>[OData]</font> ComplexTypeの下位属性の名称。例えば、 ComplexTypeが「住所」の場合、通り1・通り2・国・郵便番号・都道府県・市区町村などがComplexTypePropertyとなる。


### CORS
<font size=1>[一般]</font> Cross-Origin Resource Sharingの略称。Webページにおいて、JavaScriptが他のドメインに対しXMLHttpRequestを許可すること。[CORS対応](../apiref/current/002_CORS_Support.md)を参照。  
（詳細については[外部サイト](http://www.w3.org/TR/cors/)を参照）


### Cross Domain Access Control(クロスドメインアクセス制御)
<font size=1>[一般]</font> 異なるドメインを持つサーバに対するアクセスの制御を行うこと。Personiumでは、XMLHttpRequest Level2に基づいた[クロスドメインポリシーファイル](../apiref/current/001_Cross_Domain_Policy_File.md)によって制御されている。


## <a name="anc_e"> E</a>
### Engine Service Collection
<font size=1>[Personium]</font> ユーザがサーバ側のロジックを新たに登録するための特別なコレクション。詳細は[Engineサービスレクション](../apiref/current/379_Engine_Service_Collection_APIs.md)を参照。


### Entity
<font size=1>[OData]</font> データの記録構造のことであり、RDBにおけるテーブル1行分に相当する。例えば、名前・住所・性別といった情報に格納された値を表したもの。


### EntityType
<font size=1>[OData]</font> データの構造をEntity Data Model(EDM)であらわすための定義体。EntityがRDBにおけるテーブル1行分に相当するのに対し、EntityTypeはテーブルの上位概念を表したもの（顧客、注文内容など）


### ETag
<font size=1>[HTTP]</font> Entity Tagのこと。Webキャッシュの検証に用いる固有の識別子でクライアントの状況に応じたリクエストの送信を可能にする。  
コンテンツの更新がない場合において、レスポンスをすべて返す必要がないときにキャッシュの効果的な使用を高め、データの転送量を減らすことで帯域幅を確保する。


### Event
<font size=1>[Personium]</font> Personiumの内部および外部から発生するインスタンス。詳細は[イベント概要](../apiref/current/277_Event_Summary.md)参照。


### EventLog
<font size=1>[Personium]</font> 外部および内部イベントの発生ログ。[ログ取得API](../apiref/current/285_Retrieve_Log_File.md)によって取得可能。


### $expand クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。データ取得リクエストに付加し、指定した関連情報を同時に取得するクエリ。（[詳細事項](../apiref/current/405_Expand_Query.md)）


### External Cell
<font size=1>[Personium]</font> 外部セル。セル制御オブジェクトの1つ(ExtCell)。あるセルから見たとき外にある他のセルをURLで管理する。URLで扱うため他のユニットのセルを外部セルとして登録することができる。


### External Role
<font size=1>[Personium]</font> 外部ロール。セル制御オブジェクトの1つ(ExtRole)。特定の関係にある外部セル群において特定の役割（Role）を付与された利用者主体を表す。例えば、「所属団体（という関係にあるCell）の管理者（というロール）」や「商品購入顧客（という関係にあるCell）のかかりつけ医（というロール）」などをExternal Roleとして登録し、これとロールを紐づけることで間接的な関係にある他者に対してのデータ開示等操作を許すような使い方が可能。


## <a name="anc_f"> F</a>
### $filter クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。検索条件を指定しデータを絞り込むクエリ。（[詳細事項](../apiref/current/403_Filter_Query.md)）


### $format クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。HTTPレスポンスにおいてメディアタイプを指定するクエリ。（[詳細事項](../apiref/current/404_Format_Query.md)）


### FQDN
<font size=1>[一般]</font> Fully Qualified Domain Name（完全修飾ドメイン名）の略称。  
インターネット上の特定のコンピュータやホストを一意に定義する完全なドメイン名をあらわす  （例：host-name.domain-name.com）


### 全文検索クエリ(Full-Text Search Query)
<font size=1>[OData]</font> リクエストに「q="検索語"」を付加することで、EntityTypeに含まれている全データを対象とした全文検索を行うクエリ。（[詳細事項](../apiref/current/408_Full_Text_Search_Query.md)）


## <a name="anc_i"> I</a>
### Implicit Flow
<font size=1>[OAuth2.0]</font> <a href="http://tools.ietf.org/pdf/rfc6749.pdf">OAuth2.0</a>で規定された認可付与フローの一つ。 クライアントが (リソースオーナー認可の結果) 認可コードの代わりに直接アクセストークンを受け取る。  
詳細は[外部サイト](http://openid-foundation-japan.github.io/draft-ietf-oauth-v2-draft22.ja.html#grant-implicit)参照。


### $inlinecount クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。コレクションにおける、エンティティの数のカウントを表示するクエリ。（[詳細事項](../apiref/current/407_Inlinecount_Query.md)）


## <a name="anc_m"> M</a>
### Main Box　（メインボックス）
<font size=1>[Personium]</font> セル作成時にデフォルトで作成される、”\__”(アンダーバー2つ)と名づけられたBox。動作は通常のBoxと同様だが、削除は不可。  
アプリケーションデータを保管する目的以外にも、そのCellの固有情報（json形式を用いる）の格納に使われる。


### Message
<font size=1>[Personium]</font> Personiumにおいて、セルの間でメッセージを送受信する機能。ユーザ任意のメッセージの送受信およびセル間の関係性($links)の発行が可能。


### Multiplicity
<font size=1>[OData]</font> 多重度。AssociationEnd作成時に、関係するEntityTypeの個数を定義する。  
AssociationEndの多重度の表記は、2つのEntityTypeの間の関係では、「1」、「0..1」(0または1)、「\*」(多数)のいずれかを取る。


## <a name="anc_n"> N</a>
### NavigationProperty
<font size=1>[OData]</font> Entity Data ModelやODataのデータ構造において、Associationの 一方の End から別の End へのナビゲーションを表すProperty。


## <a name="anc_o"> O</a>
### OData
<font size=1>[OData]</font> Open Data Protocolの略称。HTTPに準拠した国際標準のデータ操作プロトコルであり、リレーショナルデータを扱うことが可能。 ODataについての詳細は[こちら](http://www.odata.org/)。


### OData Service Collection
<font size=1>[Personium]</font> ODataプロトコルで任意のリレーショナルデータを扱う操作するための特殊WebDAV拡張コレクションで、Box内の任意の階層に複数作成することができる。このコレクション以下自体がODataのサービスのルートとなっているとともに、スキーマ情報を格納する$metadata自体もスキーマ設定を行うためのOData空間のルートとなっており、ここで定義した任意のスキーマに基づいてリレーショナルデータを扱うことができる。


### $orderby クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。ユーザーが特定した順序でソートされた値を表示する。デフォルトでは昇順。（[詳細事項](../apiref/current/400_Orderby_Query.md)）


## <a name="anc_p"> P</a>
### Property
<font size=1>[OData]</font> 各EntityTypeの列頭の値。RDBにおけるテーブルの項目名に相当する。例えば「顧客」というEntityTypeには「ID」「名前」「住所」といったPropertyが考えられる。


### Privilege
<font size=1>[Personium]</font> Cell内に定義されたRoleに対し、特定のRoleに紐付けられたBox内部のデータにアクセスする権限。  
PersoniumではACLの設定によって定義される。詳細は[アクセス制御モデル](./002_Access_Control.md)参照。

## <a name="anc_r"> R</a>
### RBAC
<font size=1>[一般]</font> Role-based access controlの略称。アクセス主体ごとに直接アクセス制御を設定せず、アクセス主体にRole（役割）を割り当て、Roleに基づきアクセス制御を設定するアクセス制御方式。


### ReceivedMessage
<font size=1>[Personium]</font> 特定のセルからの、Relation発行リクエストやメッセージを受信する定義体。


### Refreshトークン
<font size=1>[OAuth2]</font> アクセストークンを再発行するために用いるトークン。リフレッシュトークンの有効時間は24時間である。


### Refreshトークン 認証
<font size=1>[Personium]</font> アクセストークンを再発行するためのプロセス。


### Relation
<font size=1>[Personium]</font> 自身（自セル）と他者（外部セル）との関係を示すセル制御オブジェクト。セル制御オブジェクトRelationとRoleをリンクすることにより、特定の関係にある他者セルからのアクセス者に一括してロールを付与することができる。 自身から見た他者への関係という一方的な関係性を独立して定義するモデルである点は注意が必要。具体的には、原則自セルのRelation登録や外部セルへの紐づけは相手の同意なく行うことができるため、
例えば「親子」という相互的な関係を表現する際は、親のセルが外部セルとして登録する子のセルに対して、親セルの中で「私の子」というRelationオブジェクトを登録して紐づけることとあわせて、子のセルが外部セルとして登録する親のセルに対して、子セルの中で「私の親」という逆のい意味を持つRelationオブジェクトを登録して紐づけることが望ましい。「友人」といった対称な関係は同一の意味を持つRelationオブジェクトを双方のセルで登録のうえ、相互の外部セルにそれを紐づけることで表現する。「ファン」のような一方的な関係であれば、片方のセルが相手に特段断ることなく相手外部セルと紐づけて管理すればよい。


### Relation クラス URL
<font size=1>[Personium]</font> アプリケーションと定義される関係リソースへのURL。RelationクラスURL構造は以下の通り:  
${Schema URL}/\_\_relation/\_\_/${RelationName}


### Relation インスタンス URL
<font size=1>[Personium]</font> 要求が1つ以上のExternal Cell(s)に送られる特定のRelationのURL。  
Relation インスタンスURLの構造は以下の通り:  
${Cell URL}/\__relation/${BoxName}/${RelationName}


### RequireSchemaAuthz
<font size=1>[Personium]</font> ACL要素の属性値であり、Boxのスキーマ権限における要求レベルを定義する。


### resourcetype
<font size=1>[WebDAV]</font> Collectionの型を表す。ODataCollection/ServiceCollection/DavCollection/fileなど。


### Role
<font size=1>[Personium]</font> セル制御オブジェクトの1つ。そのCellの中で有効「役割」をあらわす。（例：administrator、teacher、student）  
どのアカウント(ユーザ)が、そのCellにアクセスすることができるかを指定できるようになるので、Cellのアカウント所有権を規定するアクセス権限の異なった設定を持つことができる。  

### Role クラス URL
<font size=1>[Personium]</font> トランスセルトークン内部に蓄積させるためのRoleのURL。RoleクラスURLの構造は以下の通り:  
${schema URL}/\_\_role/\_\_/${RoleName}


### Role インスタンス URL
<font size=1>[Personium]</font> 特定のCellに登録されたRoleの、現行状態を提供するURL。Role Resource URLと同様。Schemaは以下の通り:  
${Cell URL}/\__role/${BoxName}/${RoleName}


### ROPC
<font size=1>[OAuth2.0]</font> Resource Owner Password Credentials (リソースオーナーパスワードクレデンシャル)の略称。[OAuth2.0](http://tools.ietf.org/pdf/rfc6749.pdf)において規定された認可プロセスの1つ。詳細は[外部サイト](http://openid-foundation-japan.github.io/draft-ietf-oauth-v2-draft22.ja.html#anchor7)参照。ID/PWを用いる、Personiumでアクセストークンを取得するための標準的な認証方法のひとつ。


## <a name="anc_s"> S</a>
### Schema URI　スキーマURI
<font size=1>[Personium]</font> Personium内に格納されたスキーマを表すURL。定義はCell URLもしくはURIである。


### $select クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。データ取得時に、特定のPropertyのみ指定して取得するクエリ。複数指定も可能。（[詳細事項](../apiref/current/406_Select_Query.md)）


### SentMessage
<font size=1>[Personium]</font> 目的のセルに対しRelation設定承認を得るためのメッセージや通常のメッセージを送信する定義体。


### Service Collection (サービスコレクション)
<font size=1>[Personium]</font> コレクション（Boxの中に格納されたのデータ集合）の1つ。ユーザ定義のサーバサイドロジックを実行するサービスのコレクション。  


### Service （サービス）登録
<font size=1>[WebDAV]</font> Serviceコレクションにユーザ定義のサーバサイドロジックを登録すること。


### $skip クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。取得したデータのうち、指定した個数の分だけ、表示から除外して抽出するクエリ。（[詳細事項](../apiref/current/402_Skip_Query.md)）


## <a name="anc_t"> T</a>
### Token (トークン)
<font size=1>[一般]</font> 主にユーザ認証に用いられるランダムな文字列。Personiumでは、格納したデータやリソースにアクセスする際に用いられる。クライアントがリクエストするcURL内に記載して使用する。  
Personiumでは以下の種類:があり、発行から1時間で変更される。  
(1)セルローカルトークン：認証されたセル内のリソースにアクセスする際に使用  
(2)トランスセルトークン：他のセルに認証されたセル内のリソースにアクセスする際に使用  



### Token (トークン)認証
<font size=1>[一般]</font> 認証プロセスの一つ。クライアントがリクエストするcURLのアクセストークンによる認証方法。詳細は[認証モデル](./003_Auth.md)を参照。


### $top クエリ
<font size=1>[OData]</font> PersoniumでサポートしているODataクエリの1つ。取得したデータの最大記録数を指定しその個数分を返す。抽出データは、セット内の最初から数えられる。（[詳細事項](../apiref/current/401_Top_Query.md)）


## <a name="anc_u"> U</a>
### Unit
<font size=1>[Personium]</font> 複数のセルをホストするサーバ。完全修飾ドメイン名（UnitFQDN）を持ち、絶対ドメイン名として参照される。


### Unit制御オブジェクト
<font size=1>[Personium]</font> ユニットユーザ（管理者）として、セルの作成や管理をするためのオブジェクト群。


### Unit User
<font size=1>[Personium]</font> ユニットの管理ユーザ。主にCellのCRUD（Create/Read/Update/Delete）の権限を持つ。


## <a name="anc_w"> W</a>
### WebDAV
<font size=1>[WebDAV]</font> Web-based Distributed Authoring and Versioningの略称。HTTPの拡張であり、Webサーバ内のドキュメントやファイルを異なるユーザで共同で執筆するためのプロトコル。  
Personiumでは、WebDAVコレクションはファイルやフォルダであり、またCRUDの機能が動作する。  
[WebDAV Resources](http://www.webdav.org/)を参照。


##### [A](#anc_a) | [B](#anc_b) | [C](#anc_c) | D | [E](#anc_e) | [F](#anc_f) | G | H | [I](#anc_i) | J | K | L | [M](#anc_m) | [N](#anc_n) | [O](#anc_o) | [P](#anc_p) | Q | [R](#anc_r) | [S](#anc_s) | [T](#anc_t) | [U](#anc_u) | V | [W](#anc_w) | X | Y | Z
<br>
<br>
<br>

