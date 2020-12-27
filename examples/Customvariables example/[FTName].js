import "./<FTName>.css";

const <FTName | capitalize> = () => {
  return (
    <>
      <div className="bg-secondary color-primary"></div>
      <div className="bg-primary color-secondary"></div>
    </>
  )
}

export default <FTName | capitalize>;