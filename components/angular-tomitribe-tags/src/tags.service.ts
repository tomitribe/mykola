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

    findTags(params) {
        return this.$http.get(this.config.tagsEndpoint, {params: params}).then(d => d.data);
    }
}
