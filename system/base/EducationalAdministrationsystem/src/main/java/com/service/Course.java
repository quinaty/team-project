package com.service;

public class Course {
    private  int course_id;
    private String course_name;
    private String course_credit;
    private String course_hours;
    private String course_department;
    private String prerequisite;

    public int getCourse_id() {
        return course_id;
    }

    public void setCourse_id(int course_id) {
        this.course_id = course_id;
    }

    public String getCourse_name() {
        return course_name;
    }

    public void setCourse_name(String course_name) {
        this.course_name = course_name;
    }

    public String getCourse_credit() {
        return course_credit;
    }

    public void setCourse_credit(String course_credit) {
        this.course_credit = course_credit;
    }

    public String getCourse_hours() {
        return course_hours;
    }

    public void setCourse_hours(String course_hours) {
        this.course_hours = course_hours;
    }

    public String getCourse_department() {
        return course_department;
    }

    public void setCourse_department(String course_department) {
        this.course_department = course_department;
    }

    public String getPrerequisite() {
        return prerequisite;
    }

    public void setPrerequisite(String prerequisite) {
        this.prerequisite = prerequisite;
    }

    @Override
    public String toString() {
        return "Course{" +
                "course_id=" + course_id +
                ", course_name='" + course_name + '\'' +
                ", course_credit='" + course_credit + '\'' +
                ", course_hours='" + course_hours + '\'' +
                ", course_department='" + course_department + '\'' +
                ", prerequisite='" + prerequisite + '\'' +
                '}';
    }
}
