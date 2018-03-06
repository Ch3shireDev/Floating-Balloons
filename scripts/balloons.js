var Balloons = {
    handle: null,
    numBalloons: 0,
    balloonsList: [],

    findFromElement: function (element) {
        while (element != null) {
            if (element.parentElement === null) return null;
            if (element.parentElement.tagName === 'svg') {
                break;
            }
            element = element.parentElement;
        }
        if (element == null) return null;

        const id = element.id;
        var name = id;

        if (name == null) return null;

        if (element.tagName === 'foreignObject') {
            return Balloons.findFromForeignId(element.id);
        }

        name = name.replace(/[0-9]*/g, '');
        if (name === 'balloon') {
            return this.findFromId(id);
        } else if (name === 'fo') {
            return this.findFromForeignId(id);
        } else {
            return null;
        }
    },

    findFromId: function (id) {
        const n = this.balloonsList.length;
        const b = this.balloonsList;
        for (let i = 0; i < n; i++) {
            if (b[i].id === id) {
                return b[i];
            }
        }
        return null;
    },

    findFromForeignId: function (id) {
        const n = this.balloonsList.length;
        const b = this.balloonsList;
        for (let i = 0; i < n; i++) {
            if (b[i].fO.getAttribute('id') === id) {
                return b[i];
            }
        }
        return null;
    },

    findFromDiv: function (div) {
        return this.findFromId(div.attr('id'));
    },

    insert: function (balloon) {
        this.balloonsList.push(balloon);
    },

    addBalloon: function (x, y) {
        const b = new Balloon(x, y);
        this.insert(b);
        return b;
    },

    getLast: function () {
        const n = this.balloonsList.length;
        if (n > 0) {
            return this.balloonsList[n - 1];
        } else {
            return null;
        }
    },

    removeLast: function () {
        const b = this.getLast();
        b.div.remove();
        b.div = null;
        b.fO.remove();
        b.fO = null;
        this.balloonsList.pop();
    },

    clear() {
        while (Balloons.balloonsList.length > 0) Balloons.removeLast();
        if (this.handle !== null) {
            this.handle.handle.remove();
        }
        this.handle = null;
    },

    showHandle() {
        var b = this.getLast();
        if (b !== null) {
            if (this.handle === null) {
                this.handle = new Handle();
            }
            this.handle.parentBalloon = b;
            this.handle.showHandle();
        }
    }
};