package com.service;

public class Grade {
    private int grade_id;
    private String selection_id;
    private String usual_grade;
    private String exam_grade;
    private String total_grade;

    public int getGrade_id() {
        return grade_id;
    }

    public void setGrade_id(int grade_id) {
        this.grade_id = grade_id;
    }

    public String getSelection_id() {
        return selection_id;
    }

    public void setSelection_id(String selection_id) {
        this.selection_id = selection_id;
    }

    public String getUsual_grade() {
        return usual_grade;
    }

    public void setUsual_grade(String usual_grade) {
        this.usual_grade = usual_grade;
    }

    public String getExam_grade() {
        return exam_grade;
    }

    public void setExam_grade(String exam_grade) {
        this.exam_grade = exam_grade;
    }

    public String getTotal_grade() {
        return total_grade;
    }

    public void setTotal_grade(String total_grade) {
        this.total_grade = total_grade;
    }

    @Override
    public String toString() {
        return "Grade{" +
                "grade_id=" + grade_id +
                ", selection_id='" + selection_id + '\'' +
                ", usual_grade='" + usual_grade + '\'' +
                ", exam_grade='" + exam_grade + '\'' +
                ", total_grade='" + total_grade + '\'' +
                '}';
    }
}
