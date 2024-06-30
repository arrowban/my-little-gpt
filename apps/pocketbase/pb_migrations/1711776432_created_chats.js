/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: '3i9eic192k50gzx',
			created: '2024-03-30 05:27:12.510Z',
			updated: '2024-03-30 05:27:12.510Z',
			name: 'chats',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: '8qhjd0d0',
					name: 'user',
					type: 'relation',
					required: true,
					presentable: false,
					unique: false,
					options: {
						collectionId: '_pb_users_auth_',
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: 'dw4u0hoq',
					name: 'model',
					type: 'json',
					required: true,
					presentable: false,
					unique: false,
					options: {
						maxSize: 2000000
					}
				},
				{
					system: false,
					id: 'b5zdv8uz',
					name: 'title',
					type: 'text',
					required: true,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				}
			],
			indexes: [],
			listRule: '@request.auth.id = user',
			viewRule: '@request.auth.id = user',
			createRule: '@request.auth.id = user',
			updateRule: '@request.auth.id = user',
			deleteRule: '@request.auth.id = user',
			options: {}
		});

		return Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3i9eic192k50gzx');

		return dao.deleteCollection(collection);
	}
);
