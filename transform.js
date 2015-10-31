var _ = require('lodash')

module.exports = function transform(opts) {

  opts = opts || {}
  var position = [0, 0]
  var scale = 1
  var angle = 0
  var rotation
  
  var set = function (opts) {
    position = _.isArray(opts.position) ? opts.position : position
    scale = _.isNumber(opts.scale) ? opts.scale : scale
    angle = _.isNumber(opts.angle) ? opts.angle : angle
    rotation = rotmat(angle)
    return this
  }

  var compose = function (opts) {
    position = _.isArray(opts.position)
      ? [position[0] + opts.position[0], position[1] + opts.position[1]] : position
    angle = _.isNumber(opts.angle) ? angle + opts.angle : angle
    scale = _.isNumber(opts.scale) ? scale * opts.scale : scale
    rotation = rotmat(angle)
    return this
  }

  var rotmat = function (angle) {
    var rad = angle * Math.PI / 180
    return [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]]
  }

  var apply = function (points) {
    points = points.map( function(xy) {
      return [xy[0] * scale, xy[1] * scale]
    })
    points = points.map( function(xy) {
      return [
        xy[0] * rotation[0][0] + xy[1] * rotation[0][1],
        xy[0] * rotation[1][0] + xy[1] * rotation[1][1],
      ]
    })
    points = points.map(function(xy) {
      return [xy[0] + position[0], xy[1] + position[1]]
    })
    return points
  }

  var invert = function (points) {
    points = points.map(function (xy) {
      return [xy[0] - position[0], xy[1] - position[1]]
    })
    points = points.map(function (xy) {
      return [
        xy[0] * rotation[0][0] - xy[1] * rotation[0][1],
        -xy[0] * rotation[1][0] + xy[1] * rotation[1][1]
      ]
    })
    points = points.map(function (xy) {
      return [xy[0] / scale, xy[1] / scale]
    })
    return points
  }

  set(opts)

  return {
    apply: apply,
    invert: invert,
    compose: compose,
    set: set,
    position: function () {return position},
    scale: function () {return scale},
    angle: function () {return angle},
    rotation: function () {return rotation}
  }

}