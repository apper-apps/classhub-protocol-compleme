import React from "react";
import Badge from "@/components/atoms/Badge";

const GradePill = ({ score, maxScore, className }) => {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const letter = getLetterGrade(percentage);
  
  const getVariant = () => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "info";
    if (percentage >= 70) return "warning";
    return "error";
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {letter} ({percentage.toFixed(0)}%)
    </Badge>
  );
};

const getLetterGrade = (percentage) => {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 65) return "D";
  return "F";
};

export default GradePill;