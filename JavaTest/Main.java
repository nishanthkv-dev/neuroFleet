import java.util.*;

class Student {
    int id;
    String name;

    Student(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public String toString() {
        return id + " - " + name;
    }
}

public class Main {
    public static void main(String[] args) {

      
        List<Student> studentList = new ArrayList<>();
        studentList.add(new Student(101, "Nishanth"));
        studentList.add(new Student(102, "Arjun"));
        studentList.add(new Student(103, "Rahul"));

        System.out.println("ArrayList Output:");
        for (Student s : studentList) {
            System.out.println(s);
        }

      Set<String> courses = new HashSet<>();
        courses.add("Java");
        courses.add("Python");
        courses.add("Java");   // duplicate

        System.out.println("\nHashSet Output:");
        for (String c : courses) {
            System.out.println(c);
        }

      
        Map<Integer, String> studentMap = new HashMap<>();
        studentMap.put(1, "Nishanth");
        studentMap.put(2, "Arjun");
        studentMap.put(3, "Rahul");

        System.out.println("\nHashMap Output:");
        for (Map.Entry<Integer, String> entry : studentMap.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}

