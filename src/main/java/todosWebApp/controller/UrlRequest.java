package todosWebApp.controller;

public class UrlRequest {

    public static final String URL_TASK_GET_BY_ID = "/task/id/{id}";

    public static final String URL_TASK_GET_BY_TITLE = "/task/title/{title}";

    public static final String URL_TASK_GET_BY_CATEGORY = "/task/category{id}";

    public static final String URL_TASK_GET_UNASSIGNED = "/task/unassigned";

    public static final String URL_TASK_GET_ALL = "/task/getAll";

    public static final String URL_TASK_GET_GIVEN_DAY = "/task/dailyTasks/date={date}";

    public static final String URL_TASK_GET_LAST_WEEK = "/task/weeklyTasks/date={date}";

    public static final String URL_TASK_GET_LAST_UNCHECKED_TASK = "/task/lastUnchecked";

    public static final String URL_TASK_CREATE = "/task/create";

    public static final String URL_TASK_DROP = "/task/drop";

    public static final String URL_TASK_SET_DONE = "/task/setDone{id}";

    public static final String URL_TASK_SET_DATE = "/task/setDate";

    public static final String URL_TASK_UNSET_DATE = "/task/unsetDate";

    public static final String URL_TASK_SET_CATEGORY = "/task/setCategory";

    public static final String URL_TASK_SET_ORDER = "/task/move";

    public static final String URL_TASK_DELETE = "/task/delete{id}";

    public static final String URL_TASK_EDIT = "/task/edit/taskID={id}";

    public static final String URL_CATEGORY_GET_BASE = "/category/getBase";

    public static final String URL_CATEGORY_GET_ALL = "/category/getAll";

    public static final String URL_CATEGORY_GET_ROOT = "/category/getRoot";

    public static final String URL_CATEGORY_GET_BY_ID = "/category/id/{id}";

    public static final String URL_CATEGORY_GET_SUBCATEGORIES_BY_PARENT = "/category/subcategories/{id}";

    public static final String URL_CATEGORY_CREATE = "/category/create";

    public static final String URL_CATEGORY_DELETE = "/category/delete{id}";

    public static final String FAIL_RETURN_VALUE = "false";

}
