const { faker } = require('@faker-js/faker');
const { pool } = require('./db');
const bcrypt = require('bcrypt');

require('dotenv').config();

const DEFAULT_PASSWORD = 'password123';

async function checkTablesExist(tableNames) {
  try {
    const queryResult = await pool.query(
      `
        SELECT table_name, EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = ANY($1)
        ) AS table_exists
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = ANY($1);
      `,
      [tableNames]
    );

    return queryResult.rows;
  } catch (error) {
    console.error('Error checking table existences:', error);
    return [];
  }
}

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20)
      );
  
      CREATE TABLE IF NOT EXISTS settings (
        office_address VARCHAR(255) NOT NULL,
        office_name VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      );
  
      CREATE TABLE IF NOT EXISTS routes (
        route_id SERIAL PRIMARY KEY,
        route_name VARCHAR(255) NOT NULL,
        employee_id INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES users (user_id)
      );
  
      CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        task_name VARCHAR(255) NOT NULL,
        route_id INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        note TEXT NOT NULL,
        FOREIGN KEY (route_id) REFERENCES routes (route_id)
      );
  
      CREATE TABLE IF NOT EXISTS issues (
        issue_id SERIAL PRIMARY KEY,
        issue_name TEXT NOT NULL,
        issue_color VARCHAR(20) NOT NULL,
        issue_type VARCHAR(30) NOT NULL
      );
  
      CREATE TABLE IF NOT EXISTS tasks_issues (
        task_id INT ,
        issue_id INT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks (task_id),
        FOREIGN KEY (issue_id) REFERENCES issues (issue_id)
      );
  
      CREATE TABLE IF NOT EXISTS materials (
        material_id SERIAL PRIMARY KEY,
        material_name VARCHAR(255) NOT NULL
      );
  
      CREATE TABLE IF NOT EXISTS tasks_materials (
        task_id INT ,
        material_id INT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks (task_id),
        FOREIGN KEY (material_id) REFERENCES materials (material_id)
      );
  
      CREATE TABLE IF NOT EXISTS tools (
        tool_id SERIAL PRIMARY KEY,
        tool_name VARCHAR(255) NOT NULL
      );
  
      CREATE TABLE IF NOT EXISTS tasks_tools (
        task_id INT,
        tool_id INT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks (task_id),
        FOREIGN KEY (tool_id) REFERENCES tools (tool_id)
      );
    `);
  } catch (error) {
    console.log('Error creating tables:', error);
  }
};

const seedDemoData = async () => {
  try {
    await pool.query(
      'INSERT INTO users (user_id, username, password, role, email, phone) VALUES ($1, $2, $3, $4, $5, $6)',
      [0, null, null, 'employee', null, null]
    );
    // Seed users
    const uniquePhoneNumbers = new Set();
    for (let i = 0; i < 2; i++) {
      const username = faker.internet.userName();
      const saltRounds = 10;
      const password = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds);
      const role = i === 0 ? 'admin' : 'employee';
      const email = faker.internet.email();
      console.log(`User: ${username} ${role}`);
      let phone;
      do {
        const areaCode = faker.datatype.number({ min: 100, max: 999 });
        const prefix = faker.datatype.number({ min: 100, max: 999 });
        const lineNumber = faker.datatype.number({ min: 1000, max: 9999 });
        phone = `${areaCode}-${prefix}-${lineNumber}`.substring(0, 20);
      } while (uniquePhoneNumbers.has(phone));
      uniquePhoneNumbers.add(phone);

      await pool.query(
        'INSERT INTO users (user_id, username, password, role, email, phone) VALUES ($1, $2, $3, $4, $5, $6)',
        [i + 1, username, password, role, email, phone]
      );
    }
    // Seed routes
    const { rows: users } = await pool.query(
      `SELECT * FROM users WHERE role = 'employee' AND username IS NOT NULL`
    );
    await pool.query(
      'INSERT INTO settings (office_address, office_name, latitude, longitude) VALUES ($1, $2, $3, $4)',
      [
        'Pflugfelder Str. 23, 71686 Ludwigsburg',
        'KWMSYS Gmb',
        48.89387428676946,
        9.190360381797298,
      ]
    );
    for (const user of users) {
      const routeName = `Route ${faker.address.street()}`;
      const status = 'pending';

      const { rows } = await pool.query(
        'INSERT INTO routes (route_name, employee_id, status) VALUES ($1, $2, $3) RETURNING route_id',
        [routeName, user.user_id, status]
      );
      const routeId = rows[0].route_id;

      // Seed tasks
      const taskCount = faker.datatype.number({ min: 3, max: 5 });

      for (let i = 0; i < taskCount; i++) {
        const taskName = `Task ${i + 1}`;
        const taskStatus = 'pending';
        const description = faker.lorem.paragraph();
        const latitude = faker.address.latitude();
        const longitude = faker.address.longitude();
        const note = faker.lorem.sentence();

        const { rows: taskRows } = await pool.query(
          'INSERT INTO tasks (task_name, route_id, status, description, latitude, longitude, note) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING task_id',
          [
            taskName,
            routeId,
            taskStatus,
            description,
            latitude,
            longitude,
            note,
          ]
        );
        const taskId = taskRows[0].task_id;

        // Seed issues
        const issueCount = faker.datatype.number({ min: 1, max: 3 });

        for (let i = 0; i < issueCount; i++) {
          const issueName = faker.lorem.sentence();

          const { rows: issueRows } = await pool.query(
            'INSERT INTO issues (issue_name, issue_color, issue_type) VALUES ($1, $2, $3) RETURNING issue_id',
            [issueName, 'Green', 'Vandalism']
          );

          const issueId = issueRows[0].issue_id;

          // Seed tasks_issues
          await pool.query(
            'INSERT INTO tasks_issues (task_id, issue_id) VALUES ($1, $2)',
            [taskId, issueId]
          );
        }

        // Seed materials
        const materialCount = faker.datatype.number({ min: 1, max: 3 });

        for (let i = 0; i < materialCount; i++) {
          const materialName = faker.commerce.productName();

          const { rows: materialRows } = await pool.query(
            'INSERT INTO materials (material_name) VALUES ($1) RETURNING material_id',
            [materialName]
          );
          const materialId = materialRows[0].material_id;

          // Seed tasks_materials
          await pool.query(
            'INSERT INTO tasks_materials (task_id, material_id) VALUES ($1, $2)',
            [taskId, materialId]
          );
        }

        // Seed tools
        const toolCount = faker.datatype.number({ min: 1, max: 5 });

        for (let i = 0; i < toolCount; i++) {
          const toolName = faker.commerce.productName();

          const { rows: toolRows } = await pool.query(
            'INSERT INTO tools (tool_name) VALUES ($1) RETURNING tool_id',
            [toolName]
          );
          const toolId = toolRows[0].tool_id;

          // Seed tasks_tools
          await pool.query(
            'INSERT INTO tasks_tools (task_id, tool_id) VALUES ($1, $2)',
            [taskId, toolId]
          );
        }
      }
    }
    console.log('Added Demo Data!');
  } catch (error) {
    console.log(error);
  }
};

const initializeDatabase = async () => {
  const tableNames = [
    'users',
    'issues',
    'tasks',
    'routes',
    'tasks_issues',
    'tasks_materials',
    'tasks_tools',
    'materials',
    'tools',
    'settings',
  ];

  try {
    const results = await checkTablesExist(tableNames);
    const tablesExist = results.some((result) => result.table_exists);
    if (!tablesExist) {
      console.log('Creating Tables and seeding demo data...');
      await createTables();
      await seedDemoData();
    } else {
      console.log('Database OK!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = initializeDatabase;
