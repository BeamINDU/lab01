export async function GET() {
  return Response.json([
    {
      url: "https://picsum.photos/id/237/200/300",
      regions: [{ x: 10, y: 20, cls: "Person", tags: [] }] 
    },
    {
      url: "https://picsum.photos/seed/picsum/200/300",
      regions: [{ x: 10, y: 20, cls: "Person", tags: [] }] 
    },
  ]);
}
