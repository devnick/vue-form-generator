import { expect } from "chai";
import { createVueField, trigger } from "../util";
import moment from "moment";

import Vue from "vue";
import FieldDateTime from "src/fields/fieldDateTime.vue";

Vue.component("FieldDateTime", FieldDateTime);

let el, vm, field;

function createField(schema = {}, model = null, disabled = false, options) {
	[ el, vm, field ] = createVueField("fieldDateTime", schema, model, disabled, options);
}

describe("fieldDateTime.vue", () => {

	describe("check template", () => {
		let schema = {
			type: "dateTime",
			label: "Event",
			model: "event"
		};
		let model = { event: 1462799081231 };
		let input;

		before( () => {
			createField(schema, model, false);
			input = el.getElementsByTagName("input")[0];
		});

		it("should contain an input text element", () => {
			expect(field).to.be.exist;
			expect(field.$el).to.be.exist;

			expect(input).to.be.defined;
			expect(input.type).to.be.equal("text");
			expect(input.classList.contains("form-control")).to.be.true;
			expect(input.disabled).to.be.false;	
		});

		it("should contain the value", (done) => {
			vm.$nextTick( () => {
				expect(input.value).to.be.equal( moment(1462799081231).format("YYYY-MM-DD HH:mm:ss") );	
				done();
			});
		});

		it("should set disabled", (done) => {
			field.disabled = true;
			vm.$nextTick( () => {
				expect(input.disabled).to.be.true;	
				done();
			});
		});

		it("input value should be the model value after changed", (done) => {
			model.event = 1234567890123;
			vm.$nextTick( () => {
				expect(input.value).to.be.equal( moment(1234567890123).format("YYYY-MM-DD HH:mm:ss") );	
				done();
			});

		});

		it("model value should be the input value if changed", (done) => {
			input.value = moment(1420194153000).format("YYYY-MM-DD HH:mm:ss");
			trigger(input, "input");

			vm.$nextTick( () => {
				expect(model.event).to.be.equal(1420194153000);	
				done();
			});

		});

	});

	describe("check YYYYMMDD format", () => {
		let schema = {
			type: "dateTime",
			label: "Event",
			model: "event",
			format: "YYYYMMDD",
			dateTimePickerOptions: {
				format: "YYYY.MM.DD"
			}
		};
		let model = { event: "20160509" };
		let input;

		before( () => {
			createField(schema, model, false);
			input = el.getElementsByTagName("input")[0];
		});

		it("should contain the value", (done) => {
			vm.$nextTick( () => {
				expect(input.value).to.be.equal( moment("20160509", schema.format).format(schema.dateTimePickerOptions.format) );	
				done();
			});
		});

		it("model value should be the formatted input value if changed", (done) => {
			input.value = "2015.01.02";
			trigger(input, "input");

			vm.$nextTick( () => {
				expect(model.event).to.be.equal( "20150102" );	
				done();
			});

		});		
	});

});
