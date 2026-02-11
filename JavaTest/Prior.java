class MyThread extends Thread {
    public void run() {
        System.out.println(
            Thread.currentThread().getName() +
            " is running with priority " +
            Thread.currentThread().getPriority()
        );
    }
}

public class Prior {
    public static void main(String[] args) {

        MyThread t1 = new MyThread();
        MyThread t2 = new MyThread();
        MyThread t3 = new MyThread();

        t1.setPriority(Thread.MIN_PRIORITY);   // minimum priority is 1
        t2.setPriority(Thread.NORM_PRIORITY);  // medium periority is 5
        t3.setPriority(Thread.MAX_PRIORITY);   // maximum priority is 10

        t1.setName("Thread-1");
        t2.setName("Thread-2");
        t3.setName("Thread-3");

        t1.start();
        t2.start();
        t3.start();
    }
}
