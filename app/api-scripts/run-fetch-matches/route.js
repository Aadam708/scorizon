import { exec } from "child_process";

export async function POST(req) {
  const { name } = await req.json();
  const leagueName = name || "FIFA Club World Cup";

  return new Promise((resolve) => {
    exec(`node app/api-scripts/fetchMatches.js "${leagueName}"`, (error, stdout, stderr) => {
      if (error) {
        resolve(
          new Response(JSON.stringify({ error: stderr || error.message }), { status: 500 })
        );
      } else {
        try {
          const matches = JSON.parse(stdout);
          resolve(
            new Response(JSON.stringify({ result: matches }), { status: 200 })
          );
        } catch (e) {
          resolve(
            new Response(JSON.stringify({ error: "Failed to parse matches", details: stdout }), { status: 500 })
          );
        }
      }
    });
  });
}
