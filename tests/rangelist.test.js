// @flow

const RangeList = require('../src/rangelist');

test('empty list', () => {
	const rl = new RangeList();
	expect(rl.toString()).toMatch("");
});

test('add', () => {
	const rl = new RangeList();
	rl.add([-5,8]);
	expect(rl.toString()).toMatch("[-5, 8)");
});

test('add more', () => {
	const rl = new RangeList();
	rl.add([-5,8]);
	rl.add([3,5]);
	rl.add([7,10]);
	rl.add([12,15]);
	rl.add([-13,-11]);
	expect(rl.toString()).toMatch("[-13, -11) [-5, 10) [12, 15)");
	rl.add([-15, 20]);
	expect(rl.toString()).toMatch("[-15, 20)");
});

test('remove', () => {
	const rl = new RangeList();
	rl.add([-50, 50]);
	rl.remove([-5,7]);
	rl.remove([3,9]);
	rl.remove([18, 20]);
	expect(rl.toString()).toMatch("[-50, -5) [9, 18) [20, 50)");
});

test('remove fail on empty', () => {
	const rl = new RangeList();
	expect(() => {
		rl.remove([18, 20]);
	}).toThrowError("Invalid Remove")
});

test('remove more than existing range', () => {
	const rl = new RangeList();
	rl.add([3, 7]);
	rl.remove([1, 20]);
	expect(rl.toString()).toMatch("");
});

test('mix add and remove', () => {
	const rl = new RangeList();
	rl.add([3,7]);
	rl.remove([5,6]);
	rl.add([6,9]);
	expect(rl.toString()).toMatch("[3, 5) [6, 9)");
});

test('ignore when right limit same as left limit', () => {
	const rl = new RangeList();
	rl.add([10,20]);
	rl.add([19,19]);
	rl.remove([16,16]);
	rl.remove([25,25]);
	expect(rl.toString()).toMatch("[10, 20)");
});

test('fail for right limit smaller than left limit', () => {
	const rl = new RangeList();
	expect(() => {
		rl.add([20,15]);
	}).toThrowError("Invalid Range")
});

test('Example Run from assignment', () => {
	// Example run
	const rl = new RangeList();

	rl.add([1, 5]);
	expect(rl.toString()).toMatch("[1, 5)")

	rl.add([10, 20]);
	expect(rl.toString()).toMatch("[1, 5) [10, 20)")

	rl.add([20, 20]);
	expect(rl.toString()).toMatch("[1, 5) [10, 20)")

	rl.add([20, 21]);
	expect(rl.toString()).toMatch("[1, 5) [10, 21)")

	rl.add([2, 4]);
	expect(rl.toString()).toMatch("[1, 5) [10, 21)")

	rl.add([3, 8]);
	expect(rl.toString()).toMatch("[1, 8) [10, 21)")

	rl.remove([10, 10]);
	expect(rl.toString()).toMatch("[1, 8) [10, 21)")

	rl.remove([10, 11]);
	expect(rl.toString()).toMatch("[1, 8) [11, 21)")

	rl.remove([15, 17]);
	expect(rl.toString()).toMatch("[1, 8) [11, 15) [17, 21)")

	rl.remove([3, 19]);
	expect(rl.toString()).toMatch("[1, 3) [19, 21)")
});


