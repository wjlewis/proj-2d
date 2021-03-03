export class Vec2 {
  constructor(public x: number, public y: number) {}

  static fromArray(v: [number, number]): Vec2 {
    return new Vec2(v[0], v[1]);
  }

  toPathPoint(): string {
    return `${this.x} ${this.y}`;
  }

  plus(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  minus(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  scale(f: number): Vec2 {
    return new Vec2(this.x * f, this.y * f);
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  proj(recv: Vec2): Vec2 {
    const f = this.dot(recv) / recv.len();
    return recv.norm().scale(f);
  }

  len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  norm(): Vec2 {
    const len = this.len();
    if (len === 0) {
      throw new Error('Cannot scale 0-vector');
    }

    return this.scale(1 / len);
  }

  perp(): Vec2 {
    return new Vec2(this.y, -this.x);
  }
}

// A 2-dimensional homogeneous matrix.
export class HMat2 {
  constructor(
    public ix: number,
    public iy: number,
    public jx: number,
    public jy: number,
    public wx: number,
    public wy: number
  ) {}

  transform(v: Vec2): Vec2 {
    return new Vec2(
      this.ix * v.x + this.jx * v.y + this.wx,
      this.iy * v.x + this.jy * v.y + this.wy
    );
  }

  transform2(v: [number, number]): Vec2 {
    return this.transform(Vec2.fromArray(v));
  }

  moveTo(v: Vec2): HMat2 {
    return new HMat2(this.ix, this.iy, this.jx, this.jy, v.x, v.y);
  }
}
