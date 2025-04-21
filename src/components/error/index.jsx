


const Error = ({ info }) => {
  return (
    <div data-testid="error" className="my-40 text-center">
      <p>Üzgünüz Bir Sorun Oluştu</p>
      <p className="my-10">{info}</p>
    </div>
  )
}

export default Error;
