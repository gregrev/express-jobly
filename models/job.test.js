"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


// ** Test creating job

describe("create", function () {
    let newJob = {
        companyHandle: "c1",
        title: "Test",
        salary: 100,
        equity: "0.1",
    };

    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual({
            id: expect.any(Number),
            companyHandle: "c1",
            title: "Test",
            salary: 100,
            equity: "0.1",
        });
    });
});

// ** Test findAll

describe("findAll", function () {
    test("works without filtering", async function () {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: "0.1",
                companyHandle: "c1",
                companyName: "C1",
            },
            {
                id: testJobIds[1],
                title: "Job2",
                salary: 200,
                equity: "0.2",
                companyHandle: "c1",
                companyName: "C1",
            },
            {
                id: testJobIds[2],
                title: "Job3",
                salary: 300,
                equity: "0",
                companyHandle: "c1",
                companyName: "C1",
            },
            {
                id: testJobIds[3],
                title: "Job4",
                salary: null,
                equity: null,
                companyHandle: "c1",
                companyName: "C1",
            },
        ]);
    });

    test("works: filter by min salary", async function () {
        let jobs = await Job.findAll({ minSalary: 250 });
        expect(jobs).toEqual([
            {
                id: testJobIds[2],
                title: "Job3",
                salary: 300,
                equity: "0",
                companyHandle: "c1",
                companyName: "C1",
            },
        ]);
    });

    test("works: by equity", async function () {
        let jobs = await Job.findAll({ hasEquity: true });
        expect(jobs).toEqual([
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: "0.1",
                companyHandle: "c1",
                companyName: "C1",
            },
            {
                id: testJobIds[1],
                title: "Job2",
                salary: 200,
                equity: "0.2",
                companyHandle: "c1",
                companyName: "C1",
            },
        ]);
    });

    test("works: by name", async function () {
        let jobs = await Job.findAll({ title: "ob1" });
        expect(jobs).toEqual([
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: "0.1",
                companyHandle: "c1",
                companyName: "C1",
            },
        ]);
    });
});


// ** Test get by ID

describe("get", function () {
    test("works: get by id", async function () {
        let job = await Job.get(testJobIds[0]);
        expect(job).toEqual({
            id: testJobIds[0],
            title: "Job1",
            salary: 100,
            equity: "0.1",
            company: {
                handle: "c1",
                name: "C1",
                description: "Desc1",
                numEmployees: 1,
                logoUrl: "http://c1.img",
            },
        });
    });

    test("not found by id", async function () {
        try {
            await Job.get(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});


// ** Test DELETE by ID

describe("delete", function () {
    test("works: deleting by id", async function () {
        await Job.remove(testJobIds[0]);
        const res = await db.query(
            "SELECT id FROM jobs WHERE id=$1", [testJobIds[0]]);
        expect(res.rows.length).toEqual(0);
    });

    test("can't delete: job not found", async function () {
        try {
            await Job.remove(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
