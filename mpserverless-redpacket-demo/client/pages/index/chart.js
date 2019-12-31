import F2 from '@antv/my-f2';
var Shape = F2.Shape;
var G = F2.G;
var Util = F2.Util;
var Global = F2.Global;
var Vector2 = G.Vector2
Shape.registerShape('interval', 'tick', {
  draw: function draw(cfg, container) {
    var points = this.parsePoints(cfg.points);
    var style = Util.mix({
      stroke: cfg.color
    }, Global.shape.interval, cfg.style);
    if (cfg.isInCircle) {
      var newPoints = points.slice(0);
      if (this._coord.transposed) {
        newPoints = [points[0], points[3], points[2], points[1]];
      }

      var _cfg$center = cfg.center,
        x = _cfg$center.x,
        y = _cfg$center.y;

      var v = [1, 0];
      var v0 = [newPoints[0].x - x, newPoints[0].y - y];
      var v1 = [newPoints[1].x - x, newPoints[1].y - y];
      var v2 = [newPoints[2].x - x, newPoints[2].y - y];

      var startAngle = Vector2.angleTo(v, v1);
      var endAngle = Vector2.angleTo(v, v2);
      var r0 = Vector2.length(v0);
      var r = Vector2.length(v1);

      if (startAngle >= 1.5 * Math.PI) {
        startAngle = startAngle - 2 * Math.PI;
      }

      if (endAngle >= 1.5 * Math.PI) {
        endAngle = endAngle - 2 * Math.PI;
      }

      var lineWidth = r - r0;
      var newRadius = r - lineWidth / 2;

      return container.addShape('Arc', {
        className: 'interval',
        attrs: Util.mix({
          x: x,
          y: y,
          startAngle: startAngle,
          endAngle: endAngle,
          r: newRadius,
          lineWidth: lineWidth,
          lineCap: 'round'
        }, style)
      });
    }
  }
});
const app = getApp();

export let chart = null;

function drawChart(canvas, width, height, value) {

  chart = new F2.Chart({
    el: canvas,
    width,
    height
    /* width: 390,
    height: 292.5 */
  });

  var data = [{
    x: '1',
    y: value / 25 >= 100 ? 100 : value / 25
  }];

  chart.source(data, {
    y: {
      max: 100,
      min: 0
    }
  });
  chart.axis(false);
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.8,
    radius: 0.85
  });
  chart.guide().arc({
    start: [0, 0],
    end: [1, 99.98],
    top: false,
    style: {
      lineWidth: 10,
      stroke: '#EDEDED',
    }
  });
  chart.guide().text({
    position: ['50%', '42%'],
    content: `今日步数`,
    style: {
      fill: '#999999',
      fontSize: 16,
    }
  });
  chart.guide().text({
    position: ['50%', '56%'],
    content: `${value}`,
    style: {
      fill: '#000000',
      fontSize: 32,
      fontWeight: 'bold',
    }
  });
  chart.interval().position('x*y').shape('tick').size(10).color('l(90) 0:#45B6FF 1:#2189FF').animate({
    appear: {
      duration: 1200,
      easing: 'cubicIn'
    }
  });
  chart.render();
  return chart;
}

export default drawChart