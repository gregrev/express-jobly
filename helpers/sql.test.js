const { sqlForPartialUpdate } = require("./sql");


describe("sqlForPartialUpdate", function () {
    test("returns object containing setCols & values", function () {
        const res = sqlForPartialUpdate(
            { firstName: 'Test', age: 23 },
            {
                firstName: "first_name",
            });
        expect(res).toEqual({
            setCols: '"first_name"=$1, "age"=$2',
            values: ['Test', 23],
        });
    });
    test("returns error if no data ", function () {
        try {
            const res = sqlForPartialUpdate({}, {});
            return res;
        } catch (err) {
            expect(err.message).toBe("No Data");
        }
    });
    test("correctly map keys to sql column names", function () {
        const res = sqlForPartialUpdate(
            { firstName: 'Test Name', lastName: 'Test Lastname', age: 99, isActive: true },
            { firstName: "first_name", lastName: "last_name", isActive: "is_active" }
        );
        expect(res).toEqual({
            setCols: '"first_name"=$1, "last_name"=$2, "age"=$3, "is_active"=$4',
            values: ['Test Name', 'Test Lastname', 99, true],
        })
    });
});