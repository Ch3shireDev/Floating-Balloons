class Point {
    constructor(x, y) {
        this.pt = Space.svg.createSVGPoint();
        this.pt.x = x;
        this.pt.y = y;
    }

    getScreenCTM() {
        return Space.svg.getScreenCTM();
    }

    toInternal() {
        const p = this.pt.matrixTransform(this.getScreenCTM().inverse());
        return [p.x, p.y];
    }

    toScreen() {
        const p = this.pt.matrixTransform(this.getScreenCTM());
        return [p.x, p.y];
    }
}