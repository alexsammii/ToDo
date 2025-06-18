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

    // status - isCompleted - boolean
    @Column
    private boolean isCompleted;

    // delete - isArchived - boolean
    @Column
    private boolean isArchived;

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

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public boolean isArchived() {
        return isArchived;
    }

    public void setArchived(boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
    

}
