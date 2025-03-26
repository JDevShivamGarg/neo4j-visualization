import React from "react";
const nodeStyles = {
    Customer: { color: "#FF4500", size: 60 },
    Company: { color: "#800080", size: 70 },
    Product: { color: "#008080", size: 65 },
    Client: { color: "#FF6347", size: 60 },
    Department: { color: "#4682B4", size: 55 },
    Employee: { color: "#228B22", size: 50 },
    Company_Objective: { color: "#B8860B", size: 50 },
    Company_Challenges: { color: "#8B0000", size: 50 },
    Department_Responsibility: { color: "#32CD32", size: 45 },
    Department_Objective: { color: "#DAA520", size: 45 },
    Department_Goal: { color: "#1E90FF", size: 45 },
    Department_Challenges: { color: "#DC143C", size: 45 },
    Department_PainPoint: { color: "#8B008B", size: 45 },
    Employee_KPI: { color: "#FF8C00", size: 40 },
    Employee_Responsibility: { color: "#FF69B4", size: 40 },
    Employee_Objective: { color: "#00CED1", size: 40 },
    Employee_Goal: { color: "#4682B4", size: 40 },
    Employee_Challenges: { color: "#C71585", size: 40 },
    Employee_PainPoint: { color: "#A52A2A", size: 40 },
    PreCustomerProduct: { color: "#00BFFF", size: 35 },
    PreCustomerChallenge: { color: "#FF4500", size: 35 },
    PreCustomerPainPoint: { color: "#8B0000", size: 35 },
    PreCustomerImpact: { color: "#B22222", size: 35 },
    VendorEvaluationTrigger: { color: "#9370DB", size: 35 },
    DecisionCriteria: { color: "#2E8B57", size: 35 },
    VendorRejectionReason: { color: "#FF0000", size: 35 },
    PostCustomerProduct: { color: "#20B2AA", size: 35 },
    ChallengesSolved: { color: "#008B8B", size: 35 },
    UseCase: { color: "#DAA520", size: 35 },
    MarketInsight: { color: "#CD5C5C", size: 35 },
    Research: { color: "#6A5ACD", size: 35 }
  };
const Sidebar = () => {
  return (
    <div className="w-64 h-screen  p-4 overflow-y-auto bg-gray-900">
      <h2 className="text-xl font-bold mb-4 text-cyan-300">Node Types</h2>
      <ul>
        {Object.entries(nodeStyles).map(([type, { color }]) => (
          <li key={type} className="flex items-center mb-2">
            <span
              className="w-4 h-4 mr-2 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            {type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
