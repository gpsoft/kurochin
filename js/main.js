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
			if ( id === '' || id === '1' ) {
				w += 10;
				h += 20;
				chin.fillOval(ctx2d, pt, w, h, '#ff0000');
			} else {
				let level = (id.match(/\-/g) || []).length;
				if ( level === 0 ) {
					chin.fillRect(ctx2d, pt, w, h, '#f64343');
				} else {
					color = '#1f1f1f';
					chin.fillRRect(ctx2d, pt, w, h,
						type===1?'#90c8ff':'#90ffbe');
				}
			}
			chin.drawText(ctx2d, pt, caption, color);
		},
	});

	let data = {
		nodes: [
			{id: '', caption: "アプリケーション\nプログラマーに\n必要なスキル"},
			{id: '1', caption: "共通"},
			{id: '2', caption: "コマンドライン\nアプリの場合"},
			{id: '3', caption: "デスクトップ\nアプリの場合"},
			{id: '4', caption: "モバイル\nアプリの場合"},
			{id: '5', caption: "Webアプリの場合"},
			{id: '1-1', type: 1, caption: "パソコン, OS"},
			{id: '1-2', type: 1, caption: "テキストエディタ"},
			{id: '1-3', type: 1, caption: "ターミナル、シェル"},
			{id: '1-4', type: 1, caption: "Git, GitHub"},
			{id: '1-5', type: 1, caption: "Docker"},
			{id: '1-6', type: 1, caption: "Virtual Box"},
			{id: '1-7', type: 2, caption: "コンピュータの仕組み\nプログラムが動く仕組み"},
			{id: '1-8', type: 2, caption: "OSの仕組み"},
			{id: '1-9', type: 2, caption: "ネットワークの仕組み"},
			{id: '1-10', type: 2, caption: "文字コード"},
			{id: '1-11', type: 2, caption: "データ構造"},
		],
		edges: [
			['', '1'], ['', '2'], ['', '3'], ['', '4'], ['', '5'],
			['1', '1-1'], ['1', '1-2'], ['1', '1-3'], ['1', '1-4'],
			['1', '1-5'], ['1', '1-6'],
			['1', '1-7'],
			['1', '1-8'],
			['1', '1-9'],
			['1', '1-10'],
			['1', '1-11'],
		],
	};

	data.nodes.forEach(n=>{
		chin.sys.addNode(n.id, n);
	});
	data.edges.forEach(([from,to])=>{
		chin.sys.addEdge(from, to);
	});
}
