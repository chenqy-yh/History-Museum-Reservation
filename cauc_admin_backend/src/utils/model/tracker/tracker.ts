export class Tracker {
    private query_count: number;
    private query_page: number;
    constructor(query_count: number = 0, query_page: number = 0) {
        this.query_count = query_count;
        this.query_page = query_page;
    }
}

export class OrderTracker extends Tracker {
    

}