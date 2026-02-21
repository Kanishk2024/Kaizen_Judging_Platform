import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const excelFilePath = path.join(process.cwd(), 'Kaizen.xlsx');

try {
  // Read the Excel file
  const workbook = XLSX.readFile(excelFilePath);

  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log('Excel data loaded successfully');
  console.log('Headers:', jsonData[0]);
  console.log('First few rows:');
  for (let i = 1; i < Math.min(6, jsonData.length); i++) {
    console.log(`Row ${i}:`, jsonData[i]);
  }

  // Kaizen.xlsx columns: Team No. (0), Organization (1), Delegates (2), Fee (3), ...
  // Rows with same Team No. + Organization = one team; each row has one delegate in column 2.
  const organizations = [];
  const teams = [];
  const members = [];
  const orgByName = new Map();
  const teamByKey = new Map(); // key: "orgId|teamNo"

  function getOrg(companyName, gst, taxNo) {
    let org = orgByName.get(companyName);
    if (!org) {
      org = {
        id: `org-${organizations.length + 1}`,
        name: companyName,
        gst: gst || `GST${organizations.length + 1}`,
        tax_no: taxNo || `TAX${organizations.length + 1}`
      };
      organizations.push(org);
      orgByName.set(companyName, org);
    } else if (gst && !org.gst) org.gst = gst;
    else if (taxNo && !org.tax_no) org.tax_no = taxNo;
    return org;
  }

  function getTeam(org, teamNo) {
    const key = `${org.id}|${teamNo}`;
    let team = teamByKey.get(key);
    if (!team) {
      team = {
        id: `team-${teams.length + 1}`,
        name: `Team ${teamNo}`,
        organizationId: org.id,
        projectTitle: `Team ${teamNo} Project`
      };
      teams.push(team);
      teamByKey.set(key, team);
    }
    return team;
  }

  // Skip header row
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length < 3) continue;

    const teamNo = row[0] != null ? String(row[0]).trim() : '';
    const companyName = row[1]?.toString().trim();
    const delegateName = row[2]?.toString().trim();
    const gst = row[10]?.toString().trim();
    const taxNo = row[11]?.toString().trim();

    if (!teamNo || !companyName || !delegateName) continue;

    const org = getOrg(companyName, gst, taxNo);
    const team = getTeam(org, teamNo);
    members.push({
      id: `member-${members.length + 1}`,
      name: delegateName,
      teamId: team.id
    });
  }

  // Generate the TypeScript code for the context
  const output = `// Auto-generated from Kaizen.xlsx
export const mockOrganizations = ${JSON.stringify(organizations, null, 2)};

export const mockTeams = ${JSON.stringify(teams, null, 2)};

export const mockMembers = ${JSON.stringify(members, null, 2)};
`;

  // Write to a file
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'excelData.ts'), output);

  console.log('Data exported to src/data/excelData.ts');
  console.log(`Found ${organizations.length} organizations, ${teams.length} teams, ${members.length} members`);

} catch (error) {
  console.error('Error reading Excel file:', error);
  process.exit(1);
}