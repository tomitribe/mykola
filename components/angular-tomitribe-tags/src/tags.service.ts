export class TagReference {
  constructor(public id: string,
              public name: string,
              public description: string/*future: tooltip*/) {
  }
}

export class TagsService {
    static $inject = ['$http', 'TribeTagsConfigurer'];

    constructor(private $http, private config) {
    }

    findTags() {
        return this.$http.get(this.config.tagsEndpoint)
          .then(d => d.data)
          .then(d => d.items)
          .then(d => (d || []).map(i => { // tolerate {id, name, description} and {name, displayName, description} as model
            return {
              name: i.id || i.name,
              displayName: i.displayName || i.name,
              description: i.description
            };
          }));
    }
}
