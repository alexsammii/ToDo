package com.example.todos.todo;

import java.util.Date;

import com.example.todos.categories.Category;
import com.example.todos.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "todos")
public class Todo extends BaseEntity {
    // task
    @Column
    private String task;

    // duedate
    @Column
    private Date dueDate;

    // time
    @Column(nullable = true)
    private String time;

    // all day state
    @Column(nullable = false)
    private boolean allDay;

    // status - Completed - boolean
    @Column
    private boolean completed;

    // delete - Archived - boolean
    @Column
    private boolean archived;

    // categories
    @ManyToOne
    private Category category;

    // getters setters
    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isAllDay() {
        return allDay;
    }

    public void setAllDay(boolean allDay) {
        this.allDay = allDay;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

}
