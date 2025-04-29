package com.service;

public class Teacher {

    private Integer teacher_id;
    private String teacher_name;
    private String teacher_department;
    private String teacher_title;
    private String contact_info;

    public Integer getTeacher_id() {
        return teacher_id;
    }

    public void setTeacher_id(Integer teacher_id) {
        this.teacher_id = teacher_id;
    }

    public String getTeacher_name() {
        return teacher_name;
    }

    public void setTeacher_name(String teacher_name) {
        this.teacher_name = teacher_name;
    }

    public String getTeacher_department() {
        return teacher_department;
    }

    public void setTeacher_department(String teacher_department) {
        this.teacher_department = teacher_department;
    }

    public String getTeacher_title() {
        return teacher_title;
    }

    public void setTeacher_title(String teacher_title) {
        this.teacher_title = teacher_title;
    }

    public String getContact_info() {
        return contact_info;
    }

    public void setContact_info(String contact_info) {
        this.contact_info = contact_info;
    }

    @Override
    public String toString() {
        return "Teacher{" +
                "teacher_id=" + teacher_id +
                ", teacher_name='" + teacher_name + '\'' +
                ", teacher_department='" + teacher_department + '\'' +
                ", teacher_title='" + teacher_title + '\'' +
                ", contact_info='" + contact_info + '\'' +
                '}';
    }
}
