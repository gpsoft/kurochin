function createChin(selector, opts) {
	let $canvas = $(selector);
	if ( $canvas.length <= 0 ) return null;

	let canvas = $canvas[0];
	let sys = arbor.ParticleSystem(
		5,		// repulsion(小さいほど親子ノード間が広がる?)
		50,		// stiffness(エッジの交差を避ける力?)
		0.1,	// friction(摩擦係数?)
		false,	// gravity
		24		// fps
	);
	let gfx = arbor.Graphics(canvas);

	// API functions
	const fillCanvas = (ctx, color)=>{
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	};
	const drawLine = (ctx, from, to, color)=>{
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.stroke();
	};
	const fillRect = (ctx, center, width, height, color)=>{
		ctx.fillStyle = color;
		ctx.fillRect(center.x - width/2, center.y - height/2,
			width, height);
	}
	const fillRRect = (ctx, center, width, height, color)=>{
		ctx.fillStyle = color;
		gfx.rect(
			center.x - width/2, center.y - height/2,
			width, height,
			4, // radius
			{fill: ctx.fillStyle}
		);
	};
	const fillOval = (ctx, center, width, height, color)=>{
		ctx.fillStyle = color;
		gfx.oval(
			center.x - width/2, center.y - height/2,
			width, height,
			{fill: ctx.fillStyle}
		);
	};
	const textSize = (ctx, text)=>{
		return text.split(/\r?\n/)
			.map(s=>_textSize(ctx, s))
			.reduce(([W,H], [w,h])=>[Math.max(W,w), H+h]);
	};
	const _textSize = (ctx, text)=>{
		let tm = ctx.measureText(text);
		let h = tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent;
		// h can be NaN here
		return [tm.width, h || tm.width/text.length*1.5];
	};
	const drawText = (ctx, center, text, color)=>{
		let ss = text.split(/\r?\n/);
		if ( ss.length <= 0 ) return;
		let [,h] = _textSize(ctx, ss[0]);
		let y = center.y - ((ss.length-1)/2*h);
		ss.forEach((s,i)=>{
			_drawText(ctx, arbor.Point(center.x, y+h*i), s, color);
		});
	}
	const _drawText = (ctx, center, text, color)=>{
		ctx.fillStyle = color;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillText(text, center.x, center.y);
	};

	const toScreenPt = ($canvas, ev)=>{
		let off = $canvas.offset();
		return arbor.Point(
			ev.pageX - off.left,
			ev.pageY - off.top
		);
	};
	const startDragging = ($canvas, node)=>{
		node.fixed = true;
		$canvas.bind('mousemove.dragging', (ev)=>{
			node.p = sys.fromScreen(toScreenPt($canvas, ev));
			return false;
		});
		$(window).bind('mouseup.dragging', (ev)=>{
			node.fixed = false;
			node.tempMass = 1000;
			$canvas.unbind('mousemove.dragging');
			$(window).unbind('mouseup.dragging');
			return false;
		});
	};
	const makeRenderer = ($canvas, opts)=>{
		let canvas = $canvas[0];
		let ctx2d = canvas.getContext('2d');
		ctx2d.font = opts.font;

		return {
			init: (system)=>{
				system.screenSize(canvas.width, canvas.height);
				system.screenPadding(100);

				$canvas.bind('mousedown', (ev)=>{
					let {node, distance} = sys.nearest(toScreenPt($canvas, ev));
					if ( node == null ) return false;

					startDragging($canvas, node);
					return false;
				});
			},
			redraw: ()=>{
				if ( opts.renderCanvas ) opts.renderCanvas(ctx2d);
				if ( opts.renderEdge ) {
					sys.eachEdge((edge, fromPt, toPt)=>{
						opts.renderEdge(ctx2d, fromPt, toPt, edge);
					});
				}
				if ( opts.renderNode ) {
					sys.eachNode((node, pt)=>{
						opts.renderNode(ctx2d, pt, node);
					});
				}
			},
		};
	};

	canvas.width = $canvas.parent().width();
	canvas.height = $canvas.parent().height();
	sys.renderer = makeRenderer($canvas, opts);

	return {
		// system objects
		sys, gfx,
		// api functions
		fillCanvas, drawLine,
		fillRect, fillRRect, fillOval,
		textSize, drawText,
	};
}
