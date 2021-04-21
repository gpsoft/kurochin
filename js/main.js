function run() {
	let chin = createChin('#chin', {
		font: 'bold 1.2em monospace',
		renderCanvas: (ctx2d)=>{
			chin.fillCanvas(ctx2d, '#fff');
		},
		renderEdge: (ctx2d, fromPt, toPt, edge)=>{
			chin.drawLine(ctx2d, fromPt, toPt, '#1f1f1f');
		},
		renderNode: (ctx2d, pt, node)=>{
			let {id, type, caption} = node.data;
			let [w, h] = chin.textSize(ctx2d, caption);
			w += 10;
			h += 10;

			var color = '#fff';
			let bgColors = ['#ff0000', '#ff0000', '#f64343',
				'#90c8ff', '#90ffbe', '#ffec90', '#ff0000', '#ffec90'];
			let bgColor = bgColors[type-1];
			if ( type == 1 || type == 2 || type == 7 ) {
				w += 10;
				h += 20;
				chin.fillOval(ctx2d, pt, w, h, bgColor);
			} else if ( type == 3 ) {
				chin.fillRect(ctx2d, pt, w, h, bgColor);
			} else {
				let level = (id.match(/\-/g) || []).length;
				color = '#1f1f1f';
				chin.fillRRect(ctx2d, pt, w, h, bgColor);
			}
			chin.drawText(ctx2d, pt, caption, color);
		},
	});

	let trees = [
		{id: 1, type: 1, caption: "アプリケーション\nプログラマーに\n必要なスキル",
			children: [
				{
					id: 1, type: 3, caption: "必修科目",
					children: [
						{id: 1, type: 4, caption: "パソコン, OS"},
						{id: 2, type: 4, caption: "テキストエディタ"},
						{id: 3, type: 4, caption: "ターミナル、シェル"},
						{id: 4, type: 4, caption: "Git, GitHub"},
						{id: 5, type: 4, caption: "Docker"},
						{id: 6, type: 4, caption: "Virtual Box"},
						{id: 7, type: 5, caption: "コンピュータの仕組み\nプログラムが動く仕組み"},
						{id: 8, type: 5, caption: "OSの仕組み"},
						{id: 9, type: 5, caption: "ネットワークの仕組み"},
						{id: 10, type: 5, caption: "文字コード"},
						{id: 11, type: 5, caption: "データ構造"},
						{id: 12, type: 5, caption: "正規表現"},
						{id: 13, type: 5, caption: "暗号、PKI"},
						{id: 14, type: 5, caption: "オブジェクト指向"},
						{id: 15, type: 5, caption: "関数型プログラミング"},
						{id: 16, type: 5, caption: "MVC"},
						{id: 17, type: 5, caption: "デザインパターン"},
						{id: 18, type: 5, caption: "外部依存"},
						{id: 19, type: 5, caption: "ビルド管理\nパッケージ管理"},
						{id: 20, type: 5, caption: "データ記法"},
						{id: 21, type: 5, caption: "デバッグ手法"},
						{id: 22, type: 5, caption: "キャッシュ"},
						{id: 23, type: 6, caption: "英語"},
						{id: 24, type: 6, caption: "タッチタイピング"},
					]},
				{id: 2, type: 3, caption: "コマンドライン\nアプリの場合",
					children: [
						{id: 1, type: 6, caption: "シェルプログラミング"},
						{id: 2, type: 4, caption: "各種コマンドライン\nユーティリティ"},
					]},
				{id: 3, type: 3, caption: "デスクトップ\nアプリの場合",
					children: [
						{id: 1, type: 4, caption: "IDE"},
						{id: 2, type: 5, caption: "ウィンドウマネージャ"},
						{id: 3, type: 5, caption: "イベントループ"},
						{id: 4, type: 6, caption: "Electron"},
						{id: 5, type: 6, caption: "GUIライブラリ"},
					]},
				{id: 4, type: 3, caption: "モバイル\nアプリの場合",
					children: [
						{id: 1, type: 4, caption: "IDE"},
						{id: 2, type: 5, caption: "イベントループ"},
						{id: 3, type: 6, caption: "React Native"},
					]},
				{id: 5, type: 3, caption: "Webアプリの場合",
					children: [
						{id: 1, type: 4, caption: "ブラウザ"},
						{id: 2, type: 4, caption: "ブラウザの\n開発者ツール"},
						{id: 3, type: 4, caption: "DBMSの\nクライアントツール"},
						{id: 4, type: 4, caption: "Linux"},
						{id: 5, type: 4, caption: "httpサーバ"},
						{id: 6, type: 4, caption: "Sassコンパイラ"},
						{id: 7, type: 4, caption: "OWASP Zap"},
						{id: 8, type: 4, caption: "クラウドサービス"},
						{id: 9, type: 5, caption: "http"},
						{id: 10, type: 5, caption: "HTML"},
						{id: 11, type: 5, caption: "HTMLテンプレート"},
						{id: 12, type: 5, caption: "css, sass"},
						{id: 13, type: 5, caption: "JavaScript"},
						{id: 14, type: 5, caption: "DBMS、ORM"},
						{id: 15, type: 5, caption: "認証、認可\nセッション"},
						{id: 16, type: 5, caption: "セキュリティ"},
						{id: 17, type: 6, caption: "SQL"},
						{id: 18, type: 6, caption: "jQuery"},
						{id: 19, type: 6, caption: "Bootstrap"},
					]},
			]},
		{id: 2, type: 7, caption: "各プログラミング言語",
			children: [
				{id: 1, type: 8, caption: "文法を学ぶ"},
				{id: 2, type: 8, caption: "定番ツールを\n使いこなす"},
				{id: 3, type: 8, caption: "標準/外部ライブラリの\n使い方を学ぶ"},
				{id: 4, type: 8, caption: "設計スタイルや\nイディオムを学ぶ"},
			]},
	];

	let data = {nodes: [], edges: []};
	const pushToData = (node, parentId)=>{
		let id = parentId ? parentId+'-'+node.id : ''+node.id;

		data.nodes.push({
			id: id,
			type: node.type,
			caption: node.caption
		});
		if ( parentId ) data.edges.push([parentId, id])

		if ( !node.children ) return;
		node.children.forEach(n=>pushToData(n, id));
	};
	trees.forEach(tree=>pushToData(tree, null));

	data.nodes.forEach(n=>{
		chin.sys.addNode(n.id, n);
	});
	data.edges.forEach(([from,to])=>{
		chin.sys.addEdge(from, to);
	});
}
