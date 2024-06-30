/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: '6e2zf3mfwbw0rh4',
			created: '2024-03-30 05:37:27.399Z',
			updated: '2024-03-30 05:37:27.399Z',
			name: 'messages',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: '6xsabpl2',
					name: 'chat',
					type: 'relation',
					required: true,
					presentable: false,
					unique: false,
					options: {
						collectionId: '3i9eic192k50gzx',
						cascadeDelete: true,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: 'saxnanp8',
					name: 'role',
					type: 'text',
					required: true,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				},
				{
					system: false,
					id: 'yvhjx4m3',
					name: 'content',
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
			listRule: '@request.auth.id = chat.user',
			viewRule: '@request.auth.id = chat.user',
			createRule: '@request.auth.id = chat.user',
			updateRule: '@request.auth.id = chat.user',
			deleteRule: '@request.auth.id = chat.user',
			options: {}
		});

		return Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('6e2zf3mfwbw0rh4');

		return dao.deleteCollection(collection);
	}
);
