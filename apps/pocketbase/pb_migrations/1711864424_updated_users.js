/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('_pb_users_auth_');

		// rules
		collection.listRule = '@request.auth.id = id';
		collection.viewRule = '@request.auth.id = id';
		collection.createRule = '';
		collection.updateRule = '@request.auth.id = id';
		collection.deleteRule = '@request.auth.id = id';

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'zpyvgt2c',
				name: 'localApiKey',
				type: 'text',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'oneielhz',
				name: 'localBaseUrl',
				type: 'url',
				required: false,
				presentable: false,
				unique: false,
				options: {
					exceptDomains: null,
					onlyDomains: null
				}
			})
		);

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'hogtgpft',
				name: 'anthropicApiKey',
				type: 'text',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'wotntpjp',
				name: 'openaiApiKey',
				type: 'text',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('_pb_users_auth_');

		// remove
		collection.schema.removeField('wotntpjp');

		// remove
		collection.schema.removeField('hogtgpft');

		// remove
		collection.schema.removeField('oneielhz');

		// remove
		collection.schema.removeField('zpyvgt2c');

		// rules
		collection.listRule = null;
		collection.viewRule = null;
		collection.createRule = null;
		collection.updateRule = null;
		collection.deleteRule = null;

		return dao.saveCollection(collection);
	}
);
