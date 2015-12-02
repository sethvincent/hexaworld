function Fixmove (data) {
  if (!data) data = {}
  this.speed = data.speed || {position: 1, angle: 10}
}

Fixmove.prototype.compute = function (current, target) {
  return this.delta(current, target)
}

Fixmove.prototype.delta = function (current, target) {
  var dist = current.distance(target)

  var speed = this.speed
  var velocity = {position: 1, angle: 1}
  var diff = current.difference(target)

  if (dist.position > speed.position) {
    diff.position[0] = diff.position[0] / dist.position
    diff.position[1] = diff.position[1] / dist.position
    velocity.position = speed.position
  }

  if (dist.angle > speed.angle) {
    diff.angle = diff.angle / dist.angle
    velocity.angle = speed.angle
    if (dist.position > speed.position) velocity.angle = speed.position * dist.angle / dist.position
  }

  return {
    position: [
      diff.position[0] * velocity.position,
      diff.position[1] * velocity.position
    ],
    angle: diff.angle * velocity.angle
  }
}

module.exports = Fixmove
