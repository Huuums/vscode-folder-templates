import "./<FFSName>.css";

const <FFSName | capitalize> = () => {
  return (
    <>
      <div className="bg-secondary color-primary"></div>
      <div className="bg-primary color-secondary"></div>
    </>
  )
}

export default <FFSName | capitalize>;