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

  projLen(recv: Vec2): number {
    const f = this.dot(recv) / recv.len();
    const projected = recv.norm().scale(f);
    const sign = f > 0 ? 1 : -1;
    return sign * projected.len();
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

  generateTransform(): HMat2 {
    const iLocal = new Vec2(this.ix, this.iy);
    const jLocal = new Vec2(this.jx, this.jy);
    const [i1, j1] = [new Vec2(1, 0), new Vec2(0, 1)].map(v => {
      const xLocal = v.projLen(iLocal);
      const yLocal = v.projLen(jLocal);
      return new Vec2(xLocal, yLocal);
    });

    return new HMat2(
      i1.x,
      i1.y,
      j1.x,
      j1.y,
      -i1.x * this.wx - j1.x * this.wy,
      -i1.y * this.wx - j1.y * this.wy
    );
  }

  after(mat: HMat2): HMat2 {
    return new HMat2(
      this.ix * mat.ix + this.jx * mat.iy,
      this.iy * mat.ix + this.jy * mat.iy,
      this.ix * mat.jx + this.jx * mat.jy,
      this.iy * mat.jx + this.jy * mat.jy,
      this.ix * mat.wx + this.jx * mat.wy + this.wx,
      this.iy * mat.wx + this.jy * mat.wy + this.wy
    );
  }
}
