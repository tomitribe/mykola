export class TagReference {
    constructor(public id: string,
                public name: string,
                public attributes: {}) {

    }
}

export class TagsService {
    static $inject = ['$http', 'TribeTagsConfigurer'];

    constructor(private $http, private config) {
    }

    findTags(query) {
        let params = {};
        params['field'] = "name";

        if (query && query.length) {
            params['query'] = query;
        }

        return this.$http.get(this.config.tagsEndpoint, {params: params}).then(d => d.data && d.data.items ? d.data.items : []);
    }
}
