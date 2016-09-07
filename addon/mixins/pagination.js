import Ember from 'ember';
export default Ember.Mixin.create({
	name: "Custom Name",
	sortingString: "ORDERfield",
	sortingKey: ["", "-"],
	render: false,
	current: 0,
	previous: 0,
	next: 0,
	total: 0,
	pages: 0,
	limit: 10,
	skip: 0,
	from: 0,
	to: 0,
	links: [],
	init() {
		this.set('render', true);
	},
	sortData(field, query) {
		query.sort =
			this.get("sortingString")
			.replace("field", Ember.get(field, 'Key'))
			.replace("ORDER", this.get('sortingKey')[Ember.get(field, 'Order') - 1]);
	},
	getBody:function(page, query){
		query.page=page;
		this.set('skip',this.get('limit')*(page-1));
	},
	update(component, meta, nelements) {
		if (meta.count !== undefined) {
			meta.total = meta.count;
		}
		this.set('total', meta.total);
		let current = Math.ceil(this.get('skip') / this.get('limit')) + 1;
		let pages = Math.ceil(this.get('total') / this.get('limit'));
		this.set('pages', pages);
		this.set('current', current);
		this.set('from', this.get('skip') + 1);
		this.set('to', this.get('from') + nelements - 1);
		this.set('previous', current > 1 ? current - 1 : 0);
		this.set('next', current < pages ? current + 1 : 0);
	},
	generateLinks() {
		const slots = 1;
		const siblings = 3;
		let cur = this.get('current');
		let pages = this.get('pages');
		let arr = [];
		let max = siblings * 2 + slots * 2 + 3;
		let de1 = slots;
		let de2 = cur - siblings;
		let df2 = pages - slots + 1;
		let df1 = cur + siblings;
		let compress = pages > max;
		let preadd = true;
		let postadd = true;

		function dummylinks(adder) {
			if (adder) {
				arr.push({
					page: "..",
					current: false
				});
			}
		}
		for (let i = 1; i <= pages; i++) {
			if (compress) {
				let TP = max - ((pages - cur) + siblings + 1 + slots + 1);
				let TP2 = max - (cur + siblings + 1 + slots);
				if ((de1 < i && i < de2) && i < de2 - TP) {
					preadd = dummylinks(preadd);
				} else if ((df1 < i && i < df2) && i > df1 + TP2) {
					postadd = dummylinks(postadd);
				} else {
					arr.push({
						page: i,
						current: cur === i
					});
				}
			} else {
				arr.push({
					page: i,
					current: cur === i
				});
			}
		}
		this.set('links', arr);
	}
});
