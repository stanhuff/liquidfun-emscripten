function TestTheoJansen() {
  camera.position.y = 15;
  camera.position.z = 50;

  this.offset = new liquidfun.b2Vec2(0.0, 8.0);
  this.motorSpeed = 2.0;
  this.motorOn = true;
  var pivot = new liquidfun.b2Vec2(0.0, 0.8);

  // Ground
  var bd = new liquidfun.b2BodyDef;
  var ground = world.CreateBody(bd);

  var shape = new liquidfun.b2EdgeShape;
  shape.Set(new liquidfun.b2Vec2(-50.0, 0.0), new liquidfun.b2Vec2(50.0, 0.0));
  ground.CreateFixtureFromShape(shape, 0.0);

  shape = new liquidfun.b2EdgeShape;
  shape.Set(new liquidfun.b2Vec2(-50.0, 0.0), new liquidfun.b2Vec2(-50.0, 10.0));
  ground.CreateFixtureFromShape(shape, 0.0);

  shape = new liquidfun.b2EdgeShape;
  shape.Set(new liquidfun.b2Vec2(50.0, 0.0), new liquidfun.b2Vec2(50.0, 10.0));
  ground.CreateFixtureFromShape(shape, 0.0);

  // Balls
  for (var i = 0; i < 40; ++i) {
    shape = new liquidfun.b2CircleShape;
    shape.radius = 0.25;

    bd = new liquidfun.b2BodyDef;
    bd.type = liquidfun.b2_dynamicBody;
    bd.position.Set(-40.0 + 2.0 * i, 0.5);

    var body = world.CreateBody(bd);
    body.CreateFixtureFromShape(shape, 1.0);
  }

  var temp = new liquidfun.b2Vec2();
  // Chassis
  shape = new liquidfun.b2PolygonShape;
  shape.SetAsBoxXY(2.5, 1.0);

  var sd = new liquidfun.b2FixtureDef;
  sd.density = 1.0;
  sd.shape = shape;
  sd.filter.groupIndex = -1;
  bd = new liquidfun.b2BodyDef;
  bd.type = liquidfun.b2_dynamicBody;
  liquidfun.b2Vec2.Add(temp, pivot, this.offset);
  bd.position = temp;
  this.chassis = world.CreateBody(bd);
  this.chassis.CreateFixtureFromDef(sd);

  shape = new liquidfun.b2CircleShape;
  shape.radius = 1.6;

  sd = new liquidfun.b2FixtureDef;
  sd.density = 1.0;
  sd.shape = shape;
  sd.filter.groupIndex = -1;
  bd = new liquidfun.b2BodyDef;
  bd.type = liquidfun.b2_dynamicBody;
  liquidfun.b2Vec2.Add(temp, pivot, this.offset);
  bd.position = temp;
  this.wheel = world.CreateBody(bd);
  this.wheel.CreateFixtureFromDef(sd);

  var jd = new liquidfun.b2RevoluteJointDef;
  jd.collideConnected = false;
  jd.motorSpeed = this.motorSpeed;
  jd.maxMotorTorque = 400.0;
  jd.enableMotor = this.motorOn;
  liquidfun.b2Vec2.Add(temp, pivot, this.offset);
  this.motorJoint =
    jd.InitializeAndCreate(this.wheel, this.chassis, temp);
  var wheelAnchor = new liquidfun.b2Vec2();

  liquidfun.b2Vec2.Add(wheelAnchor, pivot, new liquidfun.b2Vec2(0, -0.8));

  this.CreateLeg(-1.0, wheelAnchor);
  this.CreateLeg(1.0, wheelAnchor);

  this.wheel.SetTransform(this.wheel.GetPosition(), 120.0 * Math.PI / 180.0);
  this.CreateLeg(-1.0, wheelAnchor);
  this.CreateLeg(1.0, wheelAnchor);

  this.wheel.SetTransform(this.wheel.GetPosition(), -120.0 * Math.PI / 180.0);
  this.CreateLeg(-1.0, wheelAnchor);
  this.CreateLeg(1.0, wheelAnchor);

  // Create particle system.
  var psd = new liquidfun.b2ParticleSystemDef();
  psd.radius = 0.2;
  psd.dampingStrength = 0.2;
  var particleSystem = world.CreateParticleSystem(psd);

  // Create particle group on top of walker.
  var shape = new liquidfun.b2PolygonShape;
  shape.SetAsBoxXYCenterAngle(7, 0.5, new liquidfun.b2Vec2(0, 15), 0);
  var pd = new liquidfun.b2ParticleGroupDef();
  pd.shape = shape;
  var group = particleSystem.CreateParticleGroup(pd);
}

TestTheoJansen.prototype.CreateLeg = function(s, wheelAnchor) {
  var p1 = new liquidfun.b2Vec2(5.4 * s, -6.1);
  var p2 = new liquidfun.b2Vec2(7.2 * s, -1.2);
  var p3 = new liquidfun.b2Vec2(4.3 * s, -1.9);
  var p4 = new liquidfun.b2Vec2(3.1 * s, 0.8);
  var p5 = new liquidfun.b2Vec2(6.0 * s, 1.5);
  var p6 = new liquidfun.b2Vec2(2.5 * s, 3.7);

  var fd1 = new liquidfun.b2FixtureDef,
    fd2 = new liquidfun.b2FixtureDef;
  fd1.filter.groupIndex = -1;
  fd2.filter.groupIndex = -1;
  fd1.density = 1.0;
  fd2.density = 1.0;

  var poly1 = new liquidfun.b2PolygonShape,
    poly2 = new liquidfun.b2PolygonShape;

  var temp = new liquidfun.b2Vec2();
  if (s > 0.0) {
    poly1.vertices.push(p1);
    poly1.vertices.push(p2);
    poly1.vertices.push(p3);

    poly2.vertices.push(new liquidfun.b2Vec2());
    liquidfun.b2Vec2.Sub(temp, p5, p4);
    poly2.vertices.push(temp.Clone());
    liquidfun.b2Vec2.Sub(temp, p6, p4);
    poly2.vertices.push(temp.Clone());
  } else {
    poly1.vertices.push(p1);
    poly1.vertices.push(p3);
    poly1.vertices.push(p2);

    poly2.vertices.push(new liquidfun.b2Vec2());
    liquidfun.b2Vec2.Sub(temp, p6, p4);
    poly2.vertices.push(temp.Clone());
    liquidfun.b2Vec2.Sub(temp, p5, p4);
    poly2.vertices.push(temp.Clone());
  }

  fd1.shape = poly1;
  fd2.shape = poly2;

  var bd1 = new liquidfun.b2BodyDef,
    bd2 = new liquidfun.b2BodyDef;
  bd1.type = liquidfun.b2_dynamicBody;
  bd2.type = liquidfun.b2_dynamicBody;
  bd1.position = this.offset;
  liquidfun.b2Vec2.Add(temp, p4, this.offset);
  bd2.position = temp;

  bd1.angularDamping = 10.0;
  bd2.angularDamping = 10.0;

  var body1 = world.CreateBody(bd1);
  var body2 = world.CreateBody(bd2);

  body1.CreateFixtureFromDef(fd1);
  body2.CreateFixtureFromDef(fd2);

  var djd = new liquidfun.b2DistanceJointDef;

  // Using a soft distance constraint can reduce some jitter.
  // It also makes the structure seem a bit more fluid by
  // acting like a suspension system.
  djd.dampingRatio = 0.5;
  djd.frequencyHz = 10.0;

  var temp2 = new liquidfun.b2Vec2();
  liquidfun.b2Vec2.Add(temp, p2, this.offset);
  liquidfun.b2Vec2.Add(temp2, p5, this.offset);
  djd.InitializeAndCreate(body1, body2, temp, temp2);

  liquidfun.b2Vec2.Add(temp, p3, this.offset);
  liquidfun.b2Vec2.Add(temp2, p4, this.offset);
  djd.InitializeAndCreate(body1, body2, temp, temp2);

  liquidfun.b2Vec2.Add(temp, p3, this.offset);
  liquidfun.b2Vec2.Add(temp2, wheelAnchor, this.offset);
  djd.InitializeAndCreate(body1, this.wheel, temp, temp2);

  liquidfun.b2Vec2.Add(temp, p6, this.offset);
  liquidfun.b2Vec2.Add(temp2, wheelAnchor, this.offset);
  djd.InitializeAndCreate(body2, this.wheel, temp, temp2);

  var rjd = new liquidfun.b2RevoluteJointDef;
  liquidfun.b2Vec2.Add(temp, p4, this.offset);
  rjd.InitializeAndCreate(body2, this.chassis, temp);
};

TestTheoJansen.prototype.Keyboard = function(key) {
  switch (key) {
    case 'a':
      this.motorJoint.SetMotorSpeed(-this.motorSpeed);
      break;

    case 's':
      this.motorJoint.SetMotorSpeed(0.0);
      break;

    case 'd':
      this.motorJoint.SetMotorSpeed(this.motorSpeed);
      break;

    case 'm':
      this.motorJoint.EnableMotor(!this.motorJoint.IsMotorEnabled());
      break;

    case 'l':
      this.motorJoint.EnableLimit(!this.motorJoint.IsLimitEnabled());
      break;
  }
}