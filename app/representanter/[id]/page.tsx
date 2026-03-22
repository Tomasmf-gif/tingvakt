export default function DetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Detaljer</h1>
      <p className="text-gray-500">ID: {params.id}</p>
    </div>
  )
}
