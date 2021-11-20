
function Info({info, uptime}) {
  return (
    <div className="info-card ">
      <div className="box">
        <div className="text-container">
          <h4>Operating System</h4>
          <p>{info.osType}</p>
          <h4>Time Online</h4>
          <p>{uptime}</p>
          <h4>Processor Information</h4>
          <p>{info.cpuModel}</p>
        </div>
      </div>
    </div>
  );
}

export default Info;
