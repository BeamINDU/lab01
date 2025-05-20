export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received annotation:", body);
  return Response.json({ message: "Saved successfully" });
}
